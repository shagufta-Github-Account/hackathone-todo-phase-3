import multiprocessing

# Server socket
bind = "0.0.0.0:8000"

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"
worker_connections = 1000

# Timeout settings
timeout = 120
keepalive = 5

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Process naming
proc_name = "todo_api"

# Server mechanics
daemon = False
pidfile = "/tmp/gunicorn.pid"
user = None
group = None
tmp_upload_dir = None

# SSL (uncomment for production)
# keyfile = "/path/to/keyfile"
# certfile = "/path/to/certfile"

# Max requests - helps prevent memory leaks
max_requests = 1000
max_requests_jitter = 100

# Graceful timeout for worker restart
graceful_timeout = 30
