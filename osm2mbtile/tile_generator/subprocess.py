import logging
import subprocess
import sys


logger = logging.getLogger(__name__)


def subprocess_popen_live(command, shell_type=True, stdout_type=subprocess.PIPE):
    try:
        process = subprocess.Popen(command, shell=shell_type, stdout=stdout_type)
    except Exception as e:
        logger.error(f"ERROR {sys.exc_info()[1]} while running {command}")
        raise Exception
    while True:
        output = process.stdout.readline()
        if process.poll() is not None:
            break
        if output:
            logger.info(output.strip().decode())
    # Check if child process has terminated. Set and return returncode attribute. Otherwise, returns None.
    rc = process.poll()
    if rc:  # if success rc = 0 elase rc = 1
        logger.error(f"ERROR IN \n WITH COMMAND: {command}")
        raise ValueError
    else:
        return True

