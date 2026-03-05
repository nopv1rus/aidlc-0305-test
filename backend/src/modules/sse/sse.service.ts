import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface SseEvent {
  storeId: string;
  type: string;
  data: any;
}

@Injectable()
export class SseService {
  private readonly events$ = new Subject<SseEvent>();

  emit(event: SseEvent): void {
    this.events$.next(event);
  }

  subscribe(storeId: string): Observable<MessageEvent> {
    return this.events$.asObservable().pipe(
      filter((event) => event.storeId === storeId),
      map(
        (event) =>
          ({
            data: JSON.stringify({ type: event.type, data: event.data }),
          }) as MessageEvent,
      ),
    );
  }
}
