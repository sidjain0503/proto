import SessionService from '@/lib/Services/SessionService'

const MessageService = {
  getAllMessages: (sessionId) => SessionService.getMessages(sessionId),
}

export default MessageService
