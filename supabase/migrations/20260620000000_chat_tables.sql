-- chat_sessions: one row per browser tab session
create table if not exists chat_sessions (
  id         uuid primary key,
  name       text,
  email      text,
  phone      text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- chat_messages: all messages for a session
create table if not exists chat_messages (
  id         uuid primary key default gen_random_uuid(),
  session_id uuid not null references chat_sessions(id) on delete cascade,
  role       text not null check (role in ('user', 'assistant')),
  content    text not null,
  created_at timestamptz default now()
);

create index if not exists chat_messages_session_id_idx
  on chat_messages(session_id);
