const client = {
  producer: jest.fn(),
};

export const kafkaWrapper = {
  client: {
    producer: jest.fn(),
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};
