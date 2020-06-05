import { DueDateTimePipe } from './due-date-time.pipe';

describe("DueDateTimePipe", () => {
  let pipe: DueDateTimePipe;

  beforeEach(() => {
    pipe = new DueDateTimePipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return correct ISO string for given UTC date objects', () => {
    const result = pipe.transform({year: 2020, month: 5, day: 30}, 
      {hours: 6, minutes: 59, seconds: 0});
    expect(result).toEqual("2020-05-30T06:59:00.000Z");
  });

  it('should return correct ISO string with missing TimeOfDay params', () => {
    const result = pipe.transform({year: 2020, month: 5, day: 30}, 
      {hours: 1});
    expect(result).toEqual("2020-05-30T01:00:00.000Z");
  });
});