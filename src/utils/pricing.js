export const EXCHANGE_RATE = 5.2;

export function getDiscountedUsdPrice(product) {
  const price = Number(product?.price) || 0;
  const discountPercentage = Number(product?.discountPercentage) || 0;
  return price * (1 - discountPercentage / 100);
}

export function getOriginalBrlPrice(product) {
  return (Number(product?.price) || 0) * EXCHANGE_RATE;
}

export function getFinalBrlPrice(product) {
  return getDiscountedUsdPrice(product) * EXCHANGE_RATE;
}

export function getSavingsBrl(product) {
  return Math.max(0, getOriginalBrlPrice(product) - getFinalBrlPrice(product));
}

export function shouldShowDiscount(product) {
  return (Number(product?.discountPercentage) || 0) >= 5;
}

export function getDiscountLabel(product) {
  return `-${Math.round(Number(product?.discountPercentage) || 0)}%`;
}
