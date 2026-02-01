<style>
.ongoing {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.ongoing .overflow-x-auto{
    border: 2px solid #fff;
}

.ongoing .header {
    margin-top: 30px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    background: #fff;
    padding: 10px;
    border-radius: 10px;
    align-items: center;
}

.ongoing .header p {
    width: 100%;
    font-weight: 600;
    text-align: left;
    display: flex;
    align-items: center;
}

.ongoing .header a {
    min-width: 140px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    background: black;
    color: #fff;
    padding: 2px 10px;
    border-radius: 7px;
    border: none;
    font-size: 14px;
    border: 1px solid #000;
    overflow: hidden;
    z-index: 0;
    font-weight: 500;
    text-align: center;
}

.ongoing .header a::before {
    content: "";
    position: absolute;
    inset: 0;
    background: #fff;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.6s cubic-bezier(.4, 0, .2, 1);
    z-index: -1;
    border: 1px solid #000;
}

.ongoing .header a:hover::before {
    transform: scaleX(1);
}

.ongoing .header a:hover {
    color: #000;
}

.ongoing .home-list {
    width: 100%;
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
}

.ongoing .home-list .data {
    position: relative;
    width: fit-content;
    /* opsional */
}

.ongoing .home-list .data img {
    border-radius: 10px;
    width: 100%;
    display: block;
}

.ongoing .home-list .data .text {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    color: white;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.ongoing .home-list .data .text p {
    background: #000000c2;
    padding: 5px;
    font-weight: 500;
    font-size: 14px;
}

.ongoing .home-list .data .text #name {
    text-align: center;
}

.video-wrap {
    margin-top: 20px;
    max-width: 600px;
    width: 100%;
    aspect-ratio: 16 / 9;   /* rasio thumbnail / video */
    overflow: hidden;
    border-radius: 12px;
    border: 3px solid #fff;
}

.video-wrap iframe {
    width: 100%;
    height: 100%;
    border: none;
}
.ongoing .pagina{
    max-width: 600px;
    width: 100%;
    background: #fff;
    padding: 5px;
    margin-top: 5px;
    display: flex;
    border-radius: 8px;
}
.ongoing .pagina div{
    width: 100%;
    display: flex;
}
.ongoing .pagina .kiri{
    justify-content: space-between;
    gap: 10px;
}
.ongoing .pagina .kiri a, button{
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    width: 100%;
    border-radius: 5px;
    color: #fff;
    font-size: 13px;
    padding: 4px;
    cursor: pointer;
    height: 30px;
}
.ongoing .pagina .kanan{
    display: flex;
    align-items: center;
    justify-content: right;
    gap: 10px;
}
.ongoing .pagina .kanan a{
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    width: 80px;
    height: 30px;
    border-radius: 5px;
    color: #fff;
    font-size: 13px;
    padding: 4px;
    gap: 5px;
}
.ongoing .pagina .kanan span{
    font-size: 13px;
    font-weight: 600;
}

.detail{
    margin-top: 30px;
    width: 100%;
    display: flex;
    align-items: start;
    gap: 10px;
}
.detail img{
    width: 100%;
    max-width: 200px;
    border-radius: 10px;
    border: 2px solid #fff;
}
.detail .data {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: #fff;
}

.detail .data label {
    display: flex;
}

.detail .data label p {
    margin: 0;
}

.detail .data label p:first-child {
    width: 120px;
    flex-shrink: 0;
}

.overflow-x-auto{
    margin-top: 30px;
    width: 100%;
    color: #fff;
}
.overflow-x-auto td{
    font-size: 13px;
    padding: 5px;
}
.overflow-x-auto td a{
    width: 100%;
}
.overflow-x-auto td:first-child{
    width: 100%;
}
tr:not(:last-child) td {
    border-bottom: 1px solid #ffffff3b;
}

.genre{
    width: 100%;
    max-width: 700px;
    display: grid;
    grid-template-columns: repeat(4,1fr);
    gap: 20px;
    margin-top: 20px;
}
.genre a{
    border-radius: 5px;
    text-align: center;
    padding: 2px 5px;
    font-weight: 500;
    border: 2px solid white;
}


@media screen and (max-width: 400px) {
    .ongoing .home-list {
        width: 100%;
        margin-top: 20px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }
    .ongoing .pagina{
        flex-direction: column;
        gap: 10px;
    }
    .ongoing .pagina .kanan a{
        width: 100%;
    }
}
@media screen and (max-width: 570px) {
    .genre{
        grid-template-columns: repeat(2, 1fr);
    }
}
@media screen and (max-width: 600px) {
    .detail{
        flex-direction: column;
        align-items: center;
        justify-content: start;
    }
    .detail img{
        max-width: 200px;
    }
    .detail .data{
        font-size: 13px;
        width: 100%;
    }
    .detail .data label p:first-child {
        width: 100px;
        flex-shrink: 0;
    }
}
</style>