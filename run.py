from visual import app
import locale

locale.setlocale(locale.LC_ALL, 'en_US')

if __name__ == '__main__':
    app.run(port=8080)