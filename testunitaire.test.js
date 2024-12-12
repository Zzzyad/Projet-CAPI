// Fonction à tester
function sum(a, b) {
    return a + b;
  }
  
  // Test unitaire pour la fonction sum
  test('ajoute 1 + 2 pour donner 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
  