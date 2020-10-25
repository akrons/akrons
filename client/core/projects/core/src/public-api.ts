/*
 * Public API Surface of core
 */

export * from './lib/core.module';
export * from './lib/services/title-service/title.service';
export * from './lib/services/http/http.service';
export * from './lib/date-fns-date-adapter';
export * as injectors from './lib/injectors';
export * from './lib/join-path';
export * from './lib/dialogs/confirm-dialog/confirm-dialog.component';
export * from './lib/dialogs/upload/upload.component';
export * from './lib/pipes/add-date';
export * from './lib/pipes/bytex';
export * from './lib/pipes/datex';
export * from './lib/components/entry-component/entry-component.component';
export { DialogStaticService } from './lib/dialog-static-service';
