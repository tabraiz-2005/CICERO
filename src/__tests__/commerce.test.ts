import { getProducts, getProductBySlug, searchCatalog } from '../lib/commerce/api';

describe('LUCEVALIE Commerce Engine Tests', () => {
  test('getProducts retrieves all products by default', async () => {
    const products = await getProducts();
    expect(products.length).toBeGreaterThan(0);
  });

  test('getProducts filters by gender correctly', async () => {
    const womenProducts = await getProducts({ gender: 'women' });
    expect(womenProducts.every((p) => p.gender === 'women' || p.gender === 'unisex')).toBe(true);

    const menProducts = await getProducts({ gender: 'men' });
    expect(menProducts.every((p) => p.gender === 'men' || p.gender === 'unisex')).toBe(true);
  });

  test('getProductBySlug retrieves specific product', async () => {
    const product = await getProductBySlug('double-faced-cashmere-belted-overcoat');
    expect(product).not.toBeNull();
    expect(product?.title).toContain('Double-Faced Cashmere Belted Coat');
  });

  test('searchCatalog yields relevant results for query "cashmere"', async () => {
    const results = await searchCatalog('cashmere');
    expect(results.products.length).toBeGreaterThan(0);
    expect(results.totalResults).toBeGreaterThan(0);
  });
});
