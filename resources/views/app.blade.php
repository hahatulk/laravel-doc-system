<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="utf-8"/>
    <link href="favicon.ico" rel="icon"/>
    <meta content="width=device-width, initial-scale=1" name="viewport"/>
    <meta content="#000000" name="theme-color"/>
    <meta
        content="Web site created using create-react-app"
        name="description"
    />
    <link href="manifest.json" rel="manifest"/>
    <title>EDO Педколледж</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>

    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>
<body>
<div id="root"></div>

<script src="{{ asset('js/index.js') }}"></script>
</body>
</html>
