<style>
    @import url('https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

    * {
        font-family: Inter, Google Sans;
        transition: .2s;
    }

    html,
    body {
        overflow: auto;
        scrollbar-width: none;
        /* Firefox */
        -ms-overflow-style: none;
        /* IE & Edge lama */
    }

    html::-webkit-scrollbar,
    body::-webkit-scrollbar {
        display: none;
        /* Chrome, Safari, Edge */
    }

    body {
        width: 100%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        background: #000;
        align-items: center;
    }

    .navbar {
        background: #000;
        border-bottom: 2px solid #ffffff13;
        gap: 40px;
    }

    .navbar-end form {
        border: 2px solid #fff;
        border-radius: 7px;
        display: flex;
        max-width: 200px;
        width: 100%;
        padding: 3px 5px;
        gap: 5px;
    }

    .navbar-end form input {
        width: 100%;
        border: none;
        outline: none;
        color: #fff;
    }

    .navbar-end form button {
        width: 35px;
        background: #fff;
        color: #000;
        padding: 0;
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 1200px;
        width: 90%;
        flex: 1;
    }

    footer {
        margin-top: 20px;
        background: #000;
        color: rgba(255, 255, 255, 0.534);
    }

    @media screen and (max-width: 750px) {
        .navbar .root {
            padding: 0;
        }

    }
</style>