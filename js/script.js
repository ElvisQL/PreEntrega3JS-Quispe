




//FUNCION PARA CREAR CARDS
function CrearCards(arrayDeObjetos){
    let contenedorDeCards = document.getElementById("grid-box-cards")
    if (contenedorDeCards) {
        contenedorDeCards.innerHTML = ""
        for (prod of arrayDeObjetos){
        
            let newCard = document.createElement("div")
            newCard.className = "CardProducto"
            newCard.innerHTML = `
            <img src=${prod.rutaimagen} alt=prod${prod.id}>
            <div class="card-body"></div>
                <h4>${prod.nombre}</h4>
                <span>$${prod.precio}</span>
                <button class="boton-agregar" value ="${prod.nombre}">Agregar producto </button>
            `
            contenedorDeCards.appendChild(newCard)
        }

        let botonAgregar = document.querySelectorAll(".boton-agregar")
        
        for (let boton of botonAgregar){
            boton.addEventListener('click', () => agregarproducto(arrayDeObjetos,boton.value))
        }
    }
    
}

//esta funcion filtra los productos segun lo que el usuario busque
function filtradoyagregadodecards(arraydeproductos,aBuscar) {
    let aBuscarMinuscula = aBuscar.toLowerCase()
    let arrayFiltrado = arraydeproductos.filter(producto => (producto.nombre.toLowerCase().includes(aBuscarMinuscula)))
    CrearCards(arrayFiltrado)
}

//Esta funcion asigna un event listener al buscador
function BusquedaProductos(productos){
    let boton = document.getElementById("boton-buscar-catalogo")
    let input = document.getElementById("input-buscar-catalogo")
    if (boton && input){
        boton.addEventListener('click',()=>filtradoyagregadodecards(productos,input.value))
    }
    
    
}


//Esta funcion filtra por categoria los productos y actualiza
function filtraporcategoria(checkboxes,prod){
    let categoriasselect=[]
    for(let check of checkboxes) {
        
        if(check.checked){
            categoriasselect.push(check.value)
        }
    }
    let prodfiltrados=[]
    if (categoriasselect.length === 0) {
        prodfiltrados = prod
      } else {
        prodfiltrados = prod.filter(p => p.categoria.some(categoria => categoriasselect.includes(categoria)))
      }
    
    CrearCards(prodfiltrados)
}   

//Esta funcion asigna un event lister a cada checkbox
function FiltradoCategoriasProductos(productos){
    let checkboxes = document.querySelectorAll(".checkclass")
    for(let checkbox of checkboxes){ 
        checkbox.addEventListener('change',()=>filtraporcategoria(checkboxes,productos))  
    }
}

//Esta funcion filtra por precios una lista de productos
function filtrarporprecios(prod,inputRange){
    let valoractual = inputRange.value
    let outputprecio=document.getElementById("valoractual")
    outputprecio.innerText= valoractual + "$"

    let arrayPrecios = prod.filter(p => p.precio <= valoractual)
    CrearCards(arrayPrecios)
}

//Esta funcion recibe una lista de productos  para asignarle un evento al input range
function FiltradoPreciosPoductos(prod){
    let inputRange = document.getElementById("input-precio")
    if (inputRange){
        inputRange.addEventListener("input",()=>filtrarporprecios(prod,inputRange))
    }
    
}


//esta funcion agrega al local storage el producto
function agregarproducto(prod,nombreDelProducto){
    let carrito = JSON.parse(localStorage.getItem("carrito")) ||  []
    let productoExistente = carrito.find((p) => p.nombre === nombreDelProducto);

    if (productoExistente){
        productoExistente.cantidad++;
        productoExistente.precioT = productoExistente.cantidad * productoExistente.precioU
    }
    else {
        let productoAgregado = prod.find((p) => p.nombre === nombreDelProducto);
        if (productoAgregado) {
            carrito.push({
                id: productoAgregado.id,
                nombre: nombreDelProducto,
                cantidad: 1,
                imagen:productoAgregado.rutaimagen,
                precioU: productoAgregado.precio,
                precioT: productoAgregado.precio,
               
            });
            }
    } 
    localStorage.setItem("carrito", JSON.stringify(carrito));
    CambiarIconoChangito()
    ActualizarPaginaCarrito()
}
    

//Esta funcion actualiza el numero de productos en el icono del changito
function CambiarIconoChangito() {
    let carrito = JSON.parse(localStorage.getItem("carrito"))
    if (carrito){
        let aCambiar = document.getElementById("cantidad-icono-changito")
        let cantidadtotal = carrito.reduce((i,p)=>{return i + p.cantidad},0)
        aCambiar.innerText = cantidadtotal.toString()
    }
    
}



//Esta funcion recibe una lista de productos para crear cartas de productos para el carrito y tambien 
//asigna un event listener para borrar
function AgregarCardEnEspera(prod){
    let contenedor = document.getElementById("lista-carrito")
    contenedor.innerHTML=''
    let contador = 0
    for (let p of prod) {
        let li = document.createElement("li")
        li.innerHTML = `
            <div class = "card-producto-en-espera">
                <div class="titulo-producto">
                    <i id ="${p.id}" class="bi bi-trash"></i>
                    <img src = ${p.imagen}>
                    <span>${p.nombre}</span>
                </div>
                <div class ="titulo-precio">
                    <span>${p.precioU}</span>
                </div>
                <div class ="titulo-cantidad">
                    <span class = "titulo-cantidad">${p.cantidad}</span>
                </div>
                <div class ="titulo-preciototal">
                    <span class = "titulo.preciototal">${p.precioT}</span>
                </div>  
            </div>
        `
        contenedor.appendChild(li)
        contador += p.precioT
    }
    let total = document.getElementById("Total-compra")
    total.innerText = `Precio Total del carrito: ${contador}`
    QuitarProducto()

}

//esta funcion actualiza el DOM de la pagina carrito
function ActualizarPaginaCarrito(){
    let contenedor = document.querySelector(".menu-box-carrito")
    
    if (contenedor){
        let productoscarrito = JSON.parse(localStorage.getItem("carrito"))

        let box_resumen = document.querySelector("#hay-productos") 
        let box_mensaje = document.querySelector("#mensaje-no-hay")

        if (productoscarrito && productoscarrito.length !== 0) {
            box_mensaje.style.display = "none"
            box_resumen.style.display = "flex"
            AgregarCardEnEspera(productoscarrito)
        }
        else{
            
            box_resumen.style.display = "none"
            box_mensaje.style.display = "flex"
        }
    }
    
}


//esta funcion recibe un id a eliminar de la lista en el carrito y lo elimina
function eliminarProducto(id_a_eliminar){
    let carrito = JSON.parse(localStorage.getItem("carrito"))
    let indice = carrito.findIndex(p => p.id == id_a_eliminar)
    carrito.splice(indice,1)
    localStorage.setItem("carrito",JSON.stringify(carrito))
    CambiarIconoChangito()
    ActualizarPaginaCarrito()
}

//Esta funcion asigna un event listener a todos los iconos de eliminar
function QuitarProducto(){
    let eliminar = document.querySelectorAll(".bi-trash")
    if (eliminar){
        for (i of eliminar){
            console.log(i.id)
            i.addEventListener("click",function(e){
                eliminarProducto(e.target.id)
            })
        }
    }
     
}


function main() {
    let productos = [
        {id:1,nombre:"Celular Samsung Galaxy S23+",cantidad:7,categoria:["celular","samsung"],precio:400000,disponibilidad:true,rutaimagen:'../images/samsung-s23plus.png'},
        {id:2,nombre:"Celular Samsung Galaxy A54 5G",cantidad:6,categoria:["celular","samsung"],precio:200000,disponibilidad:true,rutaimagen:'../images/samsunga54.webp'},
        {id:3,nombre:"Celular Iphone 14 Pro Max",cantidad:10,categoria:["celular","apple"],precio:700000,disponibilidad:true,rutaimagen:'../images/iphone14-promax.webp'},
        {id:4,nombre:"Celular Iphone 13 Pro Max",cantidad:4,categoria:["celular","apple"],precio:550000,disponibilidad:true,rutaimagen:'../images/iphone13-promax.webp'},
        {id:5,nombre:"Televisor Philips 55' 4K UHD",cantidad:5,categoria:["tv","philips"],precio:130000,disponibilidad:true,rutaimagen:'../images/smarttvphilips74004k55.webp'},
        {id:6,nombre:"Televisor Samsung 55' 4K UHD",cantidad:7,categoria:["tv","samsung"],precio:180000,disponibilidad:true,rutaimagen:'../images/tv-samsung-qled55.webp'},
        {id:7,nombre:"Notebook Asus Intel I5",cantidad:3,categoria:["computadora","asus"],precio:300000,disponibilidad:true,rutaimagen:'../images/laptopasusinteli51135g7.webp'},
        {id:8,nombre:"Notebook Lenovo Ryzen 5",cantidad:2,categoria:["computadora","lenovo"],precio:280000,disponibilidad:true,rutaimagen:'../images/lenovoryzen5.png'},
        {id:9,nombre:"Notebook Dell Ryzen 5",cantidad:14,categoria:["computadora","dell"],precio:350000,disponibilidad:true,rutaimagen:'../images/laptopdellinspironryzen5.webp'},
        {id:10,nombre:"Celular Motorola G42 ",cantidad:1,categoria:["celular","motorola"],precio:90000,disponibilidad:true,rutaimagen:'../images/motorola642.webp'},
        {id:11,nombre:"Televisor TCL 50' 4K",cantidad:15,categoria:["tv","tcl"],precio:800000,disponibilidad:true,rutaimagen:'../images/tv504ktcl.webp'},
        {id:12,nombre:"Minicomponete Sony",cantidad:9,categoria:["audio","sony"],precio:200000,disponibilidad:true,rutaimagen:'../images/minicomponentesony.webp'},
        {id:13,nombre:"Notebook Asus Intel I3",cantidad:5,categoria:["computadora","asus"],precio:220000,disponibilidad:true,rutaimagen:'../images/laptopasusintelcorei3.webp'},
        {id:14,nombre:"Notebook Dell Intel Core I7",cantidad:6,categoria:["computadora","dell"],precio:380000,disponibilidad:true,rutaimagen:'../images/laptopdelllattideintelcorei7.webp'},
        {id:15,nombre:"Notebook Lenovo Intel Core I3",cantidad:8,categoria:["computadora","lenovo"],precio:220000,disponibilidad:true,rutaimagen:'../images/latoplenovoideapadinteli3.webp'},
        {id:16,nombre:"Minicomponente Philips",cantidad:11,categoria:["audio","philips"],precio:180000,disponibilidad:true,rutaimagen:'../images/minicomponentesphilips.webp'},
        {id:17,nombre:"Motorola Edge 30",cantidad:17,categoria:["celular","motorola"],precio:190000,disponibilidad:true,rutaimagen:'../images/motorlaedge30neo.webp'},
        {id:18,nombre:"Motorola E32",cantidad:21,categoria:["celular","motorola"],precio:80000,disponibilidad:true,rutaimagen:'../images/motorolae32.webp'},
        {id:19,nombre:"Motorola E13",cantidad:17,categoria:["celular","motorola"],precio:75000,disponibilidad:true,rutaimagen:'../images/motorolae1364gb.webp'},
        {id:20,nombre:"Nintendo Switch 64gb",cantidad:18,categoria:["consola","nintendo"],precio:250000,disponibilidad:true,rutaimagen:'../images/nintendoswitcholed64gb.webp'},
        {id:21,nombre:"Notebook HP ryzen 7",cantidad:25,categoria:["computadora","hp"],precio:300000,disponibilidad:true,rutaimagen:'../images/notebookhpvictusryzen7.webp'},
        {id:22,nombre:"Laptop Macbook pro",cantidad:20,categoria:["computadora","apple"],precio:500000,disponibilidad:true,rutaimagen:'../images/notebookmacbookpro.webp'},
        {id:23,nombre:"Parlante JBL flip 6",cantidad:24,categoria:["audio","jbl"],precio:110000,disponibilidad:true,rutaimagen:'../images/parlantejblflip6.webp'},
        {id:24,nombre:"Televisor Philips 43' smart tv UHD",cantidad:14,categoria:["tv","philips"],precio:80000,disponibilidad:true,rutaimagen:'../images/philips43smarttv.webp'},
        {id:25,nombre:"Sony Playstation 4 1TB",cantidad:10,categoria:["consola","sony"],precio:160000,disponibilidad:true,rutaimagen:'../images/plastatios41tb.webp'},
        {id:26,nombre:"Sony Playstation 5 825GB",cantidad:17,categoria:["consola","sony"],precio:350000,disponibilidad:true,rutaimagen:'../images/playstation5825gb.webp'},
        {id:27,nombre:"Samsung S23 Ultra 1TB",cantidad:3,categoria:["celular","samsung"],precio:550000,disponibilidad:true,rutaimagen:'../images/samsung-s23ultra.png'},
        {id:28,nombre:"Samsung Z Fold4 256GB",cantidad:5,categoria:["celular","samsung"],precio:260000,disponibilidad:true,rutaimagen:'../images/samsungzfold4.webp'},
        {id:29,nombre:"Televisor TCL 40' UHD",cantidad:8,categoria:["televisor","tcl"],precio:95000,disponibilidad:true,rutaimagen:'../images/tcl40fullhd.webp'},
        {id:30,nombre:"Televisor Samsung QLED 65' 4K",cantidad:17,categoria:["televisor","samsung"],precio:600000,disponibilidad:true,rutaimagen:'../images/tv-samsung-qled65.webp'},
        {id:31,nombre:"Televisor Noblex 75' 4K", cantidad:22,categoria:["televisor","noblex"],precio:650000,disponibilidad:true,rutaimagen:'../images/tvnoblex4k75.webp'},
        {id:32,nombre:"Xbox Series S 512GB", cantidad:29,categoria:["consola","xbox"],precio:250000,disponibilidad:true,rutaimagen:'../images/xboxseriesS512gb.webp'},
        {id:33,nombre:"Celular Xiaomi Redmi Note 11",cantidad:28,categoria:["celular","xiaomi"],precio:130000,disponibilidad:true,rutaimagen:'../images/xiamiredminote11.webp'},
        {id:34,nombre:"Celular Xiaomi Redmi Note 12",cantidad:30,categoria:["celular","xiaomi"],precio:190000,disponibilidad:true,rutaimagen:'../images/xiaomiredminote12.webp'}
    ]
    
    CrearCards(productos)
    CambiarIconoChangito()
    
    BusquedaProductos(productos)
    FiltradoCategoriasProductos(productos)
    FiltradoPreciosPoductos(productos)
    ActualizarPaginaCarrito()
    

}

main()