// lib/supabase/quotes.ts
import { supabase } from '@/lib/supabase/client';
import { QuoteItem, ClientData, QuoteStatus } from '@/types/quote';

export interface SaveQuotePayload {
  quoteNumber: string;
  client: ClientData;
  items: QuoteItem[];
  includeIva: boolean;
  netAmount: number;
  ivaAmount: number;
  totalAmount: number;
  terms: string;
  status?: QuoteStatus;
}

/**
 * Guarda una cotización completa en Supabase:
 * 1. Registra o vincula al cliente
 * 2. Inserta la cotización en `quotes`
 * 3. Inserta cada renglón en `quote_items`
 */
export async function saveQuoteToSupabase(payload: SaveQuotePayload) {
  try {
    // 1. Manejo del Cliente: Buscar si ya existe por teléfono o crearlo
    let clientId: string | null = null;

    if (payload.client.phone) {
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('phone', payload.client.phone)
        .maybeSingle();

      if (existingClient) {
        clientId = existingClient.id;
        // Opcional: Actualizar dirección si cambió
        if (payload.client.address) {
          await supabase
            .from('clients')
            .update({ address: payload.client.address, name: payload.client.name })
            .eq('id', clientId);
        }
      } else {
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert({
            name: payload.client.name || 'Cliente sin nombre',
            phone: payload.client.phone,
            address: payload.client.address || null,
          })
          .select('id')
          .single();

        if (!clientError && newClient) {
          clientId = newClient.id;
        }
      }
    }

    // 2. Insertar Cotización principal
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        quote_number: payload.quoteNumber,
        client_id: clientId,
        client_name: payload.client.name,
        client_phone: payload.client.phone,
        client_address: payload.client.address || '',
        status: payload.status || 'pending',
        include_iva: payload.includeIva,
        net_amount: payload.netAmount,
        iva_amount: payload.ivaAmount,
        total_amount: payload.totalAmount,
        terms: payload.terms,
      })
      .select('id')
      .single();

    if (quoteError || !quote) {
      throw new Error(`Error al guardar cotización: ${quoteError?.message}`);
    }

    // 3. Insertar las Partidas / Renglones asociados
    if (payload.items.length > 0) {
      const itemsToInsert = payload.items.map((item) => ({
        quote_id: quote.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        subtotal: item.subtotal,
      }));

      const { error: itemsError } = await supabase
        .from('quote_items')
        .insert(itemsToInsert);

      if (itemsError) {
        throw new Error(`Error al guardar ítems: ${itemsError.message}`);
      }
    }

    return { success: true, quoteId: quote.id, error: null };
  } catch (error: any) {
    console.error('Error en saveQuoteToSupabase:', error);
    return { success: false, quoteId: null, error: error.message };
  }
}

/**
 * Obtener lista de cotizaciones para el pipeline / historial
 */
export async function getQuotesFromSupabase() {
  const { data, error } = await supabase
    .from('quotes')
    .select(`
      *,
      quote_items (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener cotizaciones:', error);
    return [];
  }
  return data;
}

/**
 * Cambiar estado en terreno (Pendiente -> Aceptada -> Cobrada)
 */
export async function updateQuoteStatus(quoteId: string, status: QuoteStatus) {
  const { error } = await supabase
    .from('quotes')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', quoteId);

  return { success: !error, error };
}