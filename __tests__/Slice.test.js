import { Slice } from '../src/Slice';

class TestSlice extends Slice {
  constructor(params) {
    super(params);
    this.state = {};
  }
  getUserEmail() {}
  getUser() {}
  setEmail() {}
  sendEmail() {}
  __private() {}
  get Getter() {
    return 0;
  }
  set Setter(value) {}
}

describe('Slice', () => {
  it('getMembers returns members', () => {
    const slice = new TestSlice();
    expect(slice.__getMembers()).toStrictEqual({
      getters: ['getUserEmail', 'getUser'],
      methods: ['setEmail', 'sendEmail'],
    });
  });
});
