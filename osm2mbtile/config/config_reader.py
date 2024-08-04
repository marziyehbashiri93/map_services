import configparser as cp
from pathlib import Path


def config_parser():
    conf = cp.ConfigParser()
    conf.read(Path(__file__).parent / 'config.ini')
    return conf
