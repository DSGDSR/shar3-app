import { toast } from "sonner"
import { logger } from "./logger"
import { Translator } from "@shared"

export const noConnectionError = (T: Translator) => {
    toast.error(T('toasts.no_connection'))
    logger.debug('Not connected to network [/src/components/Dropzone/index.tsx:22]')
}