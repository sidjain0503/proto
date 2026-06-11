const { getModel } = require("../data/operations/get");

const assertSessionOwnership = async (sessionId, userId) => {
  const sessions = await getModel("session", {
    filters: { id: sessionId, user_id: userId },
    select: "id,user_id",
  });

  if (!sessions.length) {
    throw Object.assign(new Error("Session not found"), { code: 404 });
  }

  return sessions[0];
};

const listSessionsForUser = async (userId) => {
  return getModel(
    "session",
    {
      filters: { user_id: userId },
      select: "id,title,user_id,created_at",
    },
    { orderBy: "id DESC", limit: 100 }
  );
};

const getMessagesForSession = async (sessionId, userId) => {
  await assertSessionOwnership(sessionId, userId);

  return getModel(
    "message",
    {
      filters: { session_id: sessionId },
      select: "id,session_id,role,content,metadata,created_at",
    },
    { orderBy: "id ASC", limit: 500 }
  );
};

module.exports = {
  assertSessionOwnership,
  listSessionsForUser,
  getMessagesForSession,
};
