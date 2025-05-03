import os


class FileManagement:
    def __init__(self, base_dir: str = None, name: str = None, path: str = None):
        self.path = path if path else os.path.join(base_dir, name)

    def get_size(self, unit='mb'):
        exponents_map = {'bytes': 0, 'kb': 1, 'mb': 2, 'gb': 3}
        file_size = os.path.getsize(self.path)  # returns the size in bytes
        size = file_size / 1024 ** exponents_map[unit]
        return round(size, 3)

    def create_directory(self):
        if not os.path.exists(self.path):
            os.makedirs(self.path)
        return self.path

    def remove_directory(self):
        from shutil import rmtree
        if os.path.exists(self.path):
            rmtree(self.path, ignore_errors=True)

    def remove_file(self):
        os.remove(self.path)

    def is_exist(self):
        return os.path.exists(self.path)
