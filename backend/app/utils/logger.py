# app/utils/logger.py
import logging
import sys

def setup_logger():
    logger = logging.getLogger("app")
    logger.setLevel(logging.INFO)

    # Console Handler only
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    
    # Format
    formatter = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(message)s'
    )
    console_handler.setFormatter(formatter)
    
    logger.addHandler(console_handler)
    return logger

logger = setup_logger()