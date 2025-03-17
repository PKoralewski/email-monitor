Dokumentacja projektu Email Monitor

Opis projektu

Celem projektu było stworzenie proof of concept serwisu, który monitoruje skrzynkę e-mail (IMAP) i filtruje wiadomości spełniające określone kryteria. Aplikacja działa cyklicznie, sprawdzając skrzynkę odbiorczą, a następnie:

Wyszukuje e-maile z podaną frazą w tym przypadku "[RED]" w tytule.

Pobiera ich załączniki.

Przenosi przetworzone e-maile do podanego folderu w tym przypadku "OLD-RED".

Zapisuje tytuł e-maila i załączniki lokalnie.

Projekt został zaprojektowany z naciskiem na:

Wysoką wydajność.

Kompatybilność z systemem Linux.

Możliwość dalszej rozbudowy.

Struktura projektu

email-monitor/
│── src/
│   ├── config/
│   │   ├── config.js
│   ├── services/
│   │   ├── attachmentService.js
│   │   ├── emailService.js
│   │   ├── imapService.js
│── .env
│── index.js
│── package.json

Instalacja i konfiguracja

Wymagania:

Node.js (>=16.x.x)

Konto Gmail z dostępem IMAP

Konfiguracja dostępu do Gmaila

Włącz dostęp IMAP:

Wejdź w ustawienia konta Gmail (https://mail.google.com/).

W zakładce "Przekazywanie i POP/IMAP" włącz dostęp IMAP.

Ustawienia autoryzacji:

Włącz weryfikację dwuetapową w ustawieniach bezpieczeństwa Google.

Utwórz "Hasło aplikacji" w sekcji "Bezpieczeństwo" i użyj go jako IMAP_PASSWORD.

Konfiguracja pliku .env

Plik .env powinien znajdować się w katalogu głównym projektu i zawierać:

IMAP_USER=twoj_email@gmail.com
IMAP_PASSWORD=haslo_aplikacji
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
ATTACHMENTS_DIR=./attachments

Instalacja zależności

npm install

Uruchomienie aplikacji

Tryb normalny:

npm start

Tryb deweloperski (automatyczny restart po zmianach w kodzie):

npm run start:dev

Opis działania kodu

1. Główne pliki

index.js – Punkt startowy aplikacji, inicjalizuje usługi i uruchamia proces monitorowania e-maili.

package.json – Definicja zależności i skryptów uruchomieniowych.

2. Moduły serwisowe

imapService.js

Utrzymuje połączenie z serwerem IMAP.

Wyszukuje e-maile według tytułu.

Pobiera treść i załączniki wiadomości.

Przenosi przetworzone e-maile do folderu podanego folderu w zmiennej boxName zawartej w config.js.

emailService.js

Cykl pracy aplikacji – okresowo pobiera nowe e-maile.

Przetwarza znalezione wiadomości i zapisuje ich załączniki.

attachmentService.js

Odpowiada za zapis pobranych załączników na dysku.

Możliwe ulepszenia projektu

Chociaż aplikacja spełnia założenia proof of concept, istnieje kilka obszarów, które można by usprawnić:

1. Obsługa błędów

Obecnie błędy są logowane do konsoli, ale aplikacja mogłaby:

Zapisywać błędy do pliku logów.

Wysyłać powiadomienia e-mailowe w razie problemów.

Implementować strategię ponownych prób przy błędach połączenia.

2. Ulepszona obsługa załączników

Możliwość filtrowania załączników według rozszerzeń plików.

Rozpakowywanie skompresowanych załączników (ZIP, RAR).

3. Skalowalność i wydajność

Użycie bazy danych do przechowywania metadanych e-maili i załączników.

Implementacja kolejki zadań do obsługi pobierania załączników asynchronicznie.

Podsumowanie

Aplikacja spełnia wymagania zadania i udowadnia, że możliwe jest monitorowanie skrzynki IMAP oraz filtrowanie wiadomości z załącznikami. Kod został napisany w sposób umożliwiający dalszy rozwój i skalowanie.