import { Observable } from 'rxjs';
export interface SseEvent {
    storeId: string;
    type: string;
    data: any;
}
export declare class SseService {
    private readonly events$;
    emit(event: SseEvent): void;
    subscribe(storeId: string): Observable<MessageEvent>;
}
