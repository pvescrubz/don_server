@echo off
chcp 65001 > nul

:again
set /p order_id=Введите ID для отправки запроса:

echo --- Отправка запроса на http://localhost:8080/api/callback/payment ---

curl -X POST "http://localhost:8080/api/callback/payment" ^
  -H "Content-Type: application/x-www-form-urlencoded" ^
  -H "X-Forwarded-For: 94.250.252.69" ^
  -H "X-Sign: 788d13364c422190f237c5d5afa7dee0606e3902e73cfffbd4dbcf8de7d3e25bf2d91f011ddbc4c244f8209ffc9d33809f1d1b9325a3a332e1d5787da2e13164" ^
  -H "X-Time: 1682528172000" ^
  -d "id=123123&order_id=%order_id%&site_id=5&status=paid&amount=255.00&account=&type=deposit&commission=5.25"

echo.
set /p repeat=Нажмите Enter, чтобы повторить или любую клавишу + Enter, чтобы выйти:

if "%repeat%"=="" goto again