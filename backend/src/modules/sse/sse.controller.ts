import { Controller, Sse, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';

@ApiTags('실시간 이벤트')
@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse(':storeId')
  @ApiOperation({ summary: '매장 SSE 스트림 구독' })
  subscribe(@Param('storeId') storeId: string): Observable<MessageEvent> {
    return this.sseService.subscribe(storeId);
  }
}
