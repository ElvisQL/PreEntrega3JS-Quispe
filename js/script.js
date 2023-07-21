


//************************************************
//********FUNCIONES DE MODIFICACION DE DOM********
//************************************************ 

//Funcion para crear cards en el INDEX
function CrearCardsIndex(prod){
    let contenedor = document.getElementById("swiperwrapperlomasnuevo")
    if (contenedor){
        //LOS MAS NUEVOS SON LOS PRIMEROS 8 POR EJEMPLO
        for (let i = 0; i<8;i++){
            let swiper_slide = document.createElement("div")
            swiper_slide.className = "swiper-slide" 
            swiper_slide.innerHTML = `
            <div class = "CardProducto">
                <img src=${prod[i].rutaimagen} alt=prod${prod[i].id}>
                <div class="card-body">
                    <h4>${prod[i].nombre}</h4>
                    <span>$${prod[i].precio}</span>
                    <button class="boton-agregar" value ="${prod[i].nombre}">Agregar producto </button>
                </div>
            </div>
            `
            contenedor.appendChild(swiper_slide)
        }
        let botonAgregar = document.querySelectorAll(".boton-agregar")   
        for (let boton of botonAgregar){
            boton.addEventListener('click', () => agregarproducto(prod,boton.value))
        }
    }
}

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
            <div class="card-body">
                <h4>${prod.nombre}</h4>
                <span>$${prod.precio}</span>
                <button class="boton-agregar" value ="${prod.nombre}">Agregar producto </button>
            </div>
            `
            contenedorDeCards.appendChild(newCard)
        }

        let botonAgregar = document.querySelectorAll(".boton-agregar")
        
        for (let boton of botonAgregar){
            boton.addEventListener('click', () => agregarproducto(arrayDeObjetos,boton.value))
        }
    }
}

//Esta funcion actualiza el numero de productos en el icono del changito
function CambiarIconoChangito() {
    let carrito = JSON.parse(localStorage.getItem("carrito"))
    if (carrito){
        let aCambiar = document.getElementById("cantidad-icono-changito")
        let cantidadtotal = carrito.reduce((i,p)=>{return i + p.cantidad},0)
        aCambiar.innerText = cantidadtotal.toString() + " productos"
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
    Borratodo()
    FinalizarCompra()

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






//****************************************************
//*********FUNCIONES DE FILTRADO DE PRODUCTOS*********
//**************************************************** 


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
    outputprecio.innerText= "Precio: "+ valoractual + "$"

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











//****************************************************
//*********FUNCIONES DE LOCAL STORAGE*****************
//**************************************************** 


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
    localStorage.setItem("carrito", JSON.stringify(carrito))
    MostrarTostada()
    CambiarIconoChangito()
    ActualizarPaginaCarrito()
}

//esta funcion recibe un id a eliminar de la lista en el carrito y lo elimina
function eliminarProducto(id_a_eliminar){
    let carrito = JSON.parse(localStorage.getItem("carrito"))
    let indice = carrito.findIndex(p => p.id == id_a_eliminar)
    carrito.splice(indice,1)
    localStorage.setItem("carrito",JSON.stringify(carrito))
    CambiarIconoChangito()
    ActualizarPaginaCarrito()
    MostrarTostadaEliminar()
}

//Esta funcion asigna un event listener a todos los iconos de eliminar
function QuitarProducto(){
    let eliminar = document.querySelectorAll(".bi-trash")
    if (eliminar){
        for (i of eliminar){
            
            i.addEventListener("click",function(e){
                eliminarProducto(e.target.id)
            })
        }
    }
     
}

//Esta funcion elimina el local storage y vuelve a 0 el iconon del changito
function VaciarCarrito(){
    localStorage.clear()
    ActualizarPaginaCarrito()
    let aCambiar = document.getElementById("cantidad-icono-changito")
    aCambiar.innerText = "0 productos"
}

//Esta funcion asigna un event listener al boton de borrar todo
function Borratodo(){
    let boton = document.getElementById("borrartodo")
    if (boton){
        boton.addEventListener("click",mostrarmensajeeliminar)
    }
}

//Esta funcion asigna un event listener al boton de Finalizar compra
function FinalizarCompra(){
    let boton = document.getElementById("finalizar")
    if (boton){
        boton.addEventListener("click",mostrarmensajefinalizar)
    }
}


//****************************************************
//*******FUNCIONES DE TOASTIFY Y SWEETALERT***********
//**************************************************** 

//Esta funcion muestra la tostada
function MostrarTostada(){
    Toastify({
        text: "Producto Agregado",
        duration: 2000,
        gravity: "bottom",
        position: "left",
        className: "Toast",

    }).showToast()
}

//Estafuncion muestra la tostada al eliminar un producto
function MostrarTostadaEliminar(){
    Toastify({
        text:"Producto eliminado",
        duration: 2000,
        gravity: "bottom",
        position: "right",
        className: "Toast",
    }).showToast()
    
}

//esta funcion muestra un  sweet alert al eliminar un producto
function mostrarmensajeeliminar(){
    Swal.fire({
        title:"Esta seguro que desea eliminar todos los productos de su carrito?",
        icon: "warning",
        showCancelButton:true,
        confirmButtonText:"Si, seguro",
        cancelButtonText: "Cancelar",

    })
    .then((result)=>{
        if(result.isConfirmed){
            Swal.fire({
                title:"Eliminado",
                icon: "success",
                text:"Los productos han sido eliminados",
                timer:1500,
                showConfirmButton:false
            
            })
            VaciarCarrito()
            
        } 
    })
}

//Esta funcion muestra una alerta al finalizar un producto
function mostrarmensajefinalizar(){
    Swal.fire({
        title:"Desea finalizar la compra?",
        icon: "question",
        showCancelButton:true,
        confirmButtonText:"Si",
        cancelButtonText: "Cancelar",

    })
    .then((result)=>{
        if(result.isConfirmed){
            Swal.fire({
                title:"Finalizado",
                icon: "success",
                text:"Gracias,por su compra",
                timer:2000,
                showConfirmButton:false
            
            })
            VaciarCarrito()
            
        } 
    })
}


//************************************************
//**************FUNCION PRINCIPAL*****************
//************************************************ 
function main() {
    let productos =[]
    let nombreArchivo = "productos.json"
    fetch(nombreArchivo)
    .then(respuesta => {
        if(!respuesta.ok){
            console.error("Error, no se pudo obtener los datos")
        }
        return respuesta.json()
    })
    .then(prod => {
        productos = prod
        CrearCardsIndex(productos)
        CrearCards(productos)
        CambiarIconoChangito()
        
        BusquedaProductos(productos)
        FiltradoCategoriasProductos(productos)
        FiltradoPreciosPoductos(productos)
        ActualizarPaginaCarrito()
        
        
        let swiper1 = new Swiper(".mySwiper", {
        slidesPerView: 4,
        spaceBetween: 25,
        navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        });
        let swiper2 = new Swiper(".carouselMarcas", {
        slidesPerView: 5,
        spaceBetween: 20,
        navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
        },
        
        });
        
        
    })
    .catch(error => {console.log(error)})
}
main()