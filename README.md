## Создание авторизации на сайте, через сторонние сервисы.

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

### Регистрация приложения на сервисе-провайдере.
До непосредственной имплементации авторизации через сторонние сервисы необходимо, зарегистрировать наше приложение на этих сервисах.

*Для авторизации через Гугл, нам необходимо зарегистрировать наше приложение на [console.cloud.google.com/api](console.cloud.google.com/api).*
*Для авторизации через Яндекс, нам необходимо зарегистрировать наше приложение на [oauth.yandex.ru](oauth.yandex.ru).*
*Для авторизации через ГитХаб, нам необходимо зарегистрировать наше приложение на [github.com/settings/applications/new](github.com/settings/applications/new).*

Процедура регистрации нашего приложения на различных сервисах может незначительно отличаться.
Но как правило в процессе регистрации нам необходимо указать следующие данные:
- тип нашего приложения — Веб-сервис, IOS-приложение, Android-приложение и так далее;
- к каким данным пользователя мы хотим иметь доступ — имя, фамилия, пол, дата рождения, email и так далее;
- URI нашего приложения, а так же redirectURI — адрес страницы, на который пользователь будет перенаправлен после авторизации.

После регистрации приложения на сервисе у нас появится доступ к **Client ID** и **Client secret**.
**Client ID** — уникальный идентификатор приложения. Идентификатор нельзя изменить.
**Client secret** — секретный ключ приложения, которым будет подписан jwt-токен с информацией о пользователе.
Эти данные мы сохраним в переменных окружения в .env файле нашего приложения и будем использовать при создании сервиса авторизации.

Коротко о том как работает механизм **OAuth 2**.
1. Пользователь нажимает кнопку на вашем сайте «войти через ХХХ».
2. Производится обмен запросами с сервером XXX.
3. Происходит перенаправление пользователя на ХХХ для ввода пароля, логина и подтверждения передачи данных на ваш сайт.
4. Получаем токен, с помощью которого у сервера ХХХ можно запросить дополнительные данные о пользователе.
Конкретика зависит от реализации OAuth на сервис-провайдере — поддерживаемой версии протокола, поддерживаемых потоков и пр.

### Имплементация авторизации с помощью библиотеки NextAuth.js(она же Auth.js)
1. Устанавливаем библиотеку — `npm install next-auth`.

2. Добавляем динамический api-роут в папку app — `app/api/auth/[...nextauth]/route.ts`.
Все запросы к /api/auth/* (signIn, callback, signOut и т.д.) будут автоматически обрабатываться NextAuth.js.

3. Внутри `route.ts` создаём обработчик - `handler` с помощью функции `NextAuth` из библиотеки **NextAuth.js**.
Чтобы сконфигурировать данный `handler`, передаём ему объект с полем `providers`.
Данное поле будет содержать массив используемых нами провайдеров.
Провайдеры это готовые функции из **NextAuth.js**.
Вызываем каждый провайдер с аргументом в виде объекта с полями **clientId** и **clientSecret**.
Данным полям передаём через переменные окружения ранее созданные **Client ID** и **Client secret**.

Помимо поля `providers`, объект конфигурации может включать поле `secret`, `pages` и пр.
В поле `secret` хранится случайная строка необходимая для хэширования токенов, подписания/шифрования cookies и генерации криптографических ключей.
Однако, если вы задали `NEXTAUTH_SECRET` в качестве переменной окружения, вам не нужно определять этот параметр.
В поле `pages` указываем URL-адреса, которые будут использоваться, если вы хотите создать пользовательские страницы входа, выхода и ошибок.
О других необязательных полях, можно почитать в [документации](https://next-auth.js.org/configuration/options).

4. Для того чтобы обработать вход пользователя произвольными учётными данными, используем провайдер `Credentials`.
При вызове функции `Credentials`, ей так же передаём объект настроек.
В этом объекте, необходимо минимум указать два поля, `credentials` и `authorize`.
В поле `credentials` указываем данные которые хотим получить от пользвателя, в поле `authorize` — функцию, которая эти данные обрабатывает.
И на данном этапе наш api уже должен выполнять авторизацию через указанные провайдеры, если обратится по маршруту `api/auth/signin`.
Следует учитывать, что форма авторизации, кнопки входа их её стили генерируются автоматически.
![Default Form](/public/default-form.png "Default Form")

5. Чтобы проверить авторизацию пользователя используется React хук `useSession`.
Чтобы иметь возможность использовать `useSession`, сначала необходимо предоставить контекст сессии, на верхнем уровне вашего приложения.
Для этого создаём компонент `<Provider/>` и в `RootLayout` оборачиваем им содержимое всего нашего приложения.

6. Получив данные о сессии, в зависимости от того авторизован пользователь или нет, меняем кнопки *SignIn/SignOut* и скрываем/отображаем тот, или иной контент, в разных компонентах.
Следует отметить, что данные о сессии можно получить не только через хук `useSession (const session = useSession())`, но и с помощью хелпера `getServerSession (const session = await getServerSession(authConfig))`. Данный хелпер как следует из названия актуален для серверных компонентов.
`getServerSession` требуется передать тот же объект, который мы передали `NextAuth` при создании handler-а в `app/api/auth/[...nextauth]/route.ts`.

7. Приватные роуты (доступные только после авторизации) в **NextAuth.js** реализуются с помощью `middleware`.
Первое что необходимо сделать, это создать в корне приложения файл `middleware.ts`.
В нём переэкспортировать готовую `middleware` из **NextAuth.js**:
`export { default } from 'next-auth/middleware'` — эта одна единственная строка сделает приватным всё наше приложение.

Если же необходимо сделать приватными определённые страницы, то добавляем к вышеуказанному экспорту, ещё экспорт объекта `config`.
`config` включает в себя поле `matcher`, значением которого является массив в котором перечислены все роуты, которые мы хотим сделать приватными:
`export const config = { matcher: ["/profile", "/protected/:path*"] }` — приватными могут быть как статические, так и динамические роуты.
Таким вот нехитрым способом реализуем все необходимые приватные роуты.
Теперь если попытаться перейти в приватный роут, то автоматически перекинет на форму авторизации.

8. Библиотека **NextAuth.js** также предоставляет готовые функции [signIn](https://next-auth.js.org/getting-started/client#signin) и [signOut](https://next-auth.js.org/getting-started/client#signout).
Вызываем эти функции в обработчиках клика при выходе из системы, или при сабмите формы при входе.
*signIn()*:
- вызванная без аргументов, перенаправляет на страницу авторизации `/signin` (страница указывается в поле `pages`, при конфигурировании `handler`-а авторизации);
- если первым аргументом передать `id` провайдера, то перенаправление произойдёт на страницу провайдера;
- второй аргумент - объект с полями `callbackUrl`, `redirect` и дополнительными полями.
В поле `callbackUrl` можем указать url, на который будет выполнен редирект пользователя после авторизации.
В поле `redirect` указываем булево значение, `true` — разрешить редирект, `false` — отключить любые редиректы.
В дополнительных полях, которые сами описываем, можем указать данные полученные из формы при сабмите, если мы используем `credentials`-провайдер.
*signOut()*
- вызванная без аргументов, просто перезагружает страницу, после выхода пользователя из системы;
- дополнительный аргумент - объект с полем `callbackUrl`, позволяет перенаправить пользователя после выхода, на указанную в данном поле страницу.

С помощью данных функций реализовываем свою форму авторизации, вместо автоматически генерируемой.

---

Данное [Next.js](https://nextjs.org/) - приложение создано с помощью утилиты [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Запуск в режиме разработки
Для запуска dev-сервера выполните следующую команду:

```bash
npm run dev
# или
yarn dev
# или
pnpm dev
```
Откройте в браузере вкладку по следующему адресу [http://localhost:3000](http://localhost:3000).

## Изучить подробнее

Больше информации о Next.js, вы сможете получить следующих ресурсах:
- [Next.js Documentation](https://nextjs.org/docs) - особенности Next.js и API.
- [Learn Next.js](https://nextjs.org/learn) - интерактивный туторила по Next.js.

## Развертывание на Vercel

Развернуть приложение можно на [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).
Больше информации по данной теме по ссылке [Next.js deployment documentation](https://nextjs.org/docs/deployment).
