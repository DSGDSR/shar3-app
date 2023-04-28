import { toast } from "sonner"
import { logger } from "./logger"

export const noConnectionError = () => {
    toast.error('Not connected to network, you can not share files')
    logger.debug('Not connected to network [/src/components/Dropzone/index.tsx:22]')
}