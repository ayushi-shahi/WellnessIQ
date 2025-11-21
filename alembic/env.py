from logging.config import fileConfig
import os
from dotenv import load_dotenv
from sqlalchemy import engine_from_config, pool
from alembic import context
from app.database import Base
from app.models import User, Tracker, Goal, AIInsight

load_dotenv()

# Skip configparser entirely
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in environment")

# target metadata
target_metadata = Base.metadata

def run_migrations_offline():
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    from sqlalchemy import create_engine
    connectable = create_engine(DATABASE_URL)
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
