import {BaseRouter} from '@essential-projects/http_node';
import {restSettings} from '@process-engine/logging_api_contracts';

import {wrap} from 'async-middleware';

import {LoggingApiController} from './logging_api_controller';

export class LoggingApiRouter extends BaseRouter {

  private _loggingApiRestController: LoggingApiController;

  constructor(loggingApiRestController: LoggingApiController) {
    super();
    this._loggingApiRestController = loggingApiRestController;
  }

  private get loggingApiRestController(): LoggingApiController {
    return this._loggingApiRestController;
  }

  public get baseRoute(): string {
    return 'api/logging/v1';
  }

  public async initializeRouter(): Promise<void> {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    const controller: LoggingApiController = this.loggingApiRestController;

    this.router.get(restSettings.paths.getLogsForCorrelation, wrap(controller.getLogsForCorrelation.bind(controller)));
    this.router.get(restSettings.paths.getLogsForProcessInstance, wrap(controller.getLogsForProcessInstance.bind(controller)));
    this.router.post(restSettings.paths.writeLogForProcessModel, wrap(controller.writeLogForProcessModel.bind(controller)));
    this.router.post(restSettings.paths.writeLogForFlowNodeInstance, wrap(controller.writeLogForFlowNodeInstance.bind(controller)));
  }
}
