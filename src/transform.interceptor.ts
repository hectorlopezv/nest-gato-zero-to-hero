import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { map } from 'rxjs/operators';
@Injectable()
export class transformerInterceptor {
  intercept(_: ExecutionContext, next: CallHandler<any>) {
    //esto es antes del controller
    //1233

    //estos es depues delcontroller
    //se ejecuta lo del despues del handler()
    return next.handle().pipe(map((data) => instanceToPlain(data)));
  }
}
