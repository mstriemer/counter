import counter from 'reducers/counter';

describe('counter reducer', () => {
  it('starts at 0', () => {
    assert.equal(counter(undefined, {}), 0);
  });

  it('can be incremented', () => {
    assert.equal(counter(5, {type: 'INCREMENT'}), 6);
  });

  it('can be decremented', () => {
    assert.equal(counter(5, {type: 'DECREMENT'}), 4);
  });
});
