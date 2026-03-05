import { SseService, SseEvent } from './sse.service';
import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

describe('SseService', () => {
  let service: SseService;

  beforeEach(() => {
    service = new SseService();
  });

  it('should emit and receive events for matching storeId', async () => {
    const event: SseEvent = {
      storeId: 'store-1',
      type: 'new_order',
      data: { orderId: '123' },
    };

    const promise = firstValueFrom(service.subscribe('store-1').pipe(take(1)));
    service.emit(event);

    const result = await promise;
    const parsed = JSON.parse(result.data);
    expect(parsed.type).toBe('new_order');
    expect(parsed.data.orderId).toBe('123');
  });

  it('should not receive events for different storeId', (done) => {
    const sub = service.subscribe('store-2').subscribe({
      next: () => done.fail('Should not receive event'),
    });

    service.emit({ storeId: 'store-1', type: 'test', data: {} });

    setTimeout(() => {
      sub.unsubscribe();
      done();
    }, 50);
  });
});
