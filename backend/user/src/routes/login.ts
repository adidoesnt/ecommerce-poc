import { Router } from "express";
import { userController } from "controllers";
import { contextPath } from "config.json";
import { Logger } from "utils";
import type { ControllerProps } from "controllers/types";

const { login: loginPath } = contextPath.user;

const logger = new Logger({
    module: 'routes/login/login',
});

const router = Router();

router.post(loginPath, async (request, response, next) => {
    logger.info(`POST ${loginPath}`);
    return await userController.login({ request, response, next });
});

const handleLoginSuccess = (
    request: ControllerProps['request'],
    response: ControllerProps['response'],
    next: ControllerProps['next'],
) => {
    const method = request.method.toUpperCase();
    logger.info(`${method} ${loginPath}/success`);
    return userController.loginSuccess({ request, response, next });
};

const handleLoginFailure = (
    request: ControllerProps['request'],
    response: ControllerProps['response'],
    next: ControllerProps['next'],
) => {
    const method = request.method.toUpperCase();
    logger.info(`${method} ${loginPath}/failure`);
    return userController.loginFailure({ request, response, next });
};

router
    .route(`${loginPath}/success`)
    .get(handleLoginSuccess)
    .post(handleLoginSuccess);

router
    .route(`${loginPath}/failure`)
    .get(handleLoginFailure)
    .post(handleLoginFailure);

export default router;
