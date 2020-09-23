/* eslint-disable no-console */
import stripeCharger from 'stripe';

import { getQueue, getOrderId } from '../models/queues.model';
import { getActiveMenu, addOrderToHistory } from '../models/bars.model';

const stripeAccount = stripeCharger(process.env.STRIPE_SK);

export const getMenu = async (req, res) => {
  const { barId } = req.params;
  try {
    const menu = await getActiveMenu(barId);
    const queue = await getQueue(barId);
    menu.open = queue.open;
    res.status(200);
    res.send(menu);
  } catch (e) {
    console.log('Something went wrong while fetching the menu');
    res.status(500);
    res.send({ Error: 'Something went wrong while fetching the menu' });
  }
};

export const pay = async (req, res) => {
  const { barId } = req.params;
  const { order } = req.body;
  try {
    const nextOrderId = await getOrderId(barId);
    const confirmation = {
      ...order,
      status: 'paid',
      timestamp: new Date().toISOString(),
      orderId: nextOrderId,
    };
    addOrderToHistory(barId, confirmation);
    res.status(200);
    res.send(confirmation);
  } catch (e) {
    console.log(`Something went wrong with the payment ${order}: `, e);
    res.status(500);
    res.send({ Error: 'Something went wrong with the payment' });
  }
};
