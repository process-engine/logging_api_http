import {BaseRouter} from '@essential-projects/http_node';
import {restSettings} from '@process-engine/logging_api_contracts';

import {wrap} from 'async-middleware';

import {LoggingApiController} from './logging_api_controller';

export class LoggingApiRouter extends BaseRouter {

  private loggingApiRestController: LoggingApiController;

  constructor(loggingApiRestController: LoggingApiController) {
    super();
    this.loggingApiRestController = loggingApiRestController;
  }

  public get baseRoute(): string {
    return 'api/logging/v1';
  }

  public async initializeRouter(): Promise<void> {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    const controller = this.loggingApiRestController;

    this.router.get(restSettings.paths.getLogForProcessModel, wrap(controller.readLogForProcessModel.bind(controller)));
  }

}
