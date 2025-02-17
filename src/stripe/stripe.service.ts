import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { Metadata, Metadatum } from 'src/recharge_plan_movements/interface_stripe';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';

@Injectable() 
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-10-28.acacia'
    });
  }

  async createCheckoutSession(data: {
    amount: number;
    description: string;
    currency?: string;
    metadata?: Record<string, string>;
    line_items?: any;
  }) {
    
    const FRONTEND_URL = process.env.FRONTEND_URL;
    // console.log(FRONTEND_URL,'FRONTEND_URL');
    const successUrl = new URL('payment/payment', FRONTEND_URL).toString();
    const cancelUrl = new URL('payment/cancel', FRONTEND_URL).toString();
  
    if (data.amount < 10) {
      throw new Error('El monto mínimo para el pago es de 10 MXN.');
    }
  
    try {
      const amountInCents = Math.round(data.amount * 100);
  // console.log(JSON.stringify(data.line_items, null, 2),'line_items');
      // El problema es que estás intentando agregar metadata dentro de product_data,
      // pero la API de Stripe no acepta metadata en ese nivel.
      // La metadata solo se puede agregar a nivel de sesión, que ya lo estás haciendo correctamente con metadata: data.metadata
      
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: data.line_items.map(item => ({
          price_data: {
            currency: item.price_data.currency?.toLowerCase() || 'mxn',
            product_data: {
              name: item.price_data.product_data.name,
              description: item.price_data.product_data.description
              // La metadata no va aquí dentro de product_data
            },
            unit_amount: Math.round(item.price_data.unit_amount * 100),
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`, 
        cancel_url: cancelUrl,
        metadata: data.metadata, // Aquí es donde debe ir la metadata a nivel sesión
      });
      // console.log('Sesión de Stripe creada:', session);
      return session;

    } catch (error) {
      console.error('Error al crear sesión de Stripe:', {
        error,
        data
      });
      throw error;
    }
  }

  async checkPaymentStatus(sessionId: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        session.payment_intent as string
      );
      // console.log('Estado de la sesión de Stripe checkPaymentStatus:', session);
      // console.log('Estado del pago checkPaymentStatus:', paymentIntent);
      return {
        status: paymentIntent.status,
        metadata: session.metadata,
        amount: session.amount_total,
        paymentIntentId: session.payment_intent
      };

    } catch (error) {
      console.error('Error al verificar el estado del pago:', error);
      throw error;
    }
  }




  async retrieveSession(sessionId: string) {
    // console.log('[Backend StripeService] Recuperando sesión de Stripe', { sessionId });
    
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      const secionlineItems = await this.stripe.checkout.sessions.listLineItems(sessionId);
      console.log('[Backend StripeService] Sesión recuperada:', {
        paymentStatus: session.payment_status,
        paymentIntent: session.payment_intent,
        amount: session.amount_total,
        lineItems: secionlineItems
      });
      // console.log(JSON.stringify(secionlineItems, null, 2),'lineItems');
      // console.log('Estado de la sesión de Stripe retrieveSession:', session);
      return session;
    } catch (error) {
      console.error('[Backend StripeService] Error recuperando sesión:', error);
      throw error;
    }
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'mxn',
    metadata?: Record<string, any>
  ): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe requiere el monto en centavos
        currency: currency.toLowerCase(),
        metadata,
        payment_method_types: ['card'],
      });
    } catch (error) {
      console.error('Error creando PaymentIntent:', error);
      throw error;
    }
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      if (!paymentIntentId || typeof paymentIntentId !== 'string') {
        throw new Error('PaymentIntent ID inválido o no proporcionado');
      }

      if (!paymentIntentId.startsWith('pi_')) {
        throw new Error('Formato de PaymentIntent ID inválido');
      }

      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error('Error recuperando PaymentIntent:', error);
      throw error;
    }
  }

  
}