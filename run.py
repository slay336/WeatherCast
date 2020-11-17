from visual import app
import locale

try:
    locale.setlocale(locale.LC_ALL, 'en_US')
except locale.Error:
    locale.setlocale(locale.LC_ALL, 'en_US.utf8')

if __name__ == '__main__':
    app.run(port=8080)