// Storage Controller
const StorageController = (function () {
    
    return {
        storeProduct: function (product) {
            let products;
            if (localStorage.getItem('products') === null) {
                products = [];
                products.push(product);
            } else {
                products = JSON.parse(localStorage.getItem('products'));
                products.push(product);
            }
            localStorage.setItem('products', JSON.stringify(products));
        },
        getProducts: function () {
            let products;
            if (localStorage.getItem('products') === null) {
                products = [];
            } else {
                products = JSON.parse(localStorage.getItem('products'));
            }
            return products;
        },
        updateProduct: function (product) {
            let products = JSON.parse(localStorage.getItem('products'));
            products.forEach(function (prd, index) {
                if (product.id == prd.id) {
                    products.splice(index, 1, product);
               } 
            });
            localStorage.setItem('products', JSON.stringify(products));
        },
        deleteProduct: function (id) {
            let products = JSON.parse(localStorage.getItem('products'));
            products.forEach(function (prd, index) {
                if (id == prd.id) {
                    products.splice(index, 1);
               } 
            });
            localStorage.setItem('products', JSON.stringify(products));
        }
    }
})();

// Product Controller
const ProductController = (function () {
    // private
    const Product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
    const data = {
        products: StorageController.getProducts(),
        selectedProduct: null,
        totalPrice: 0,
    }

    // public
    return {
        getProducts: function () {
            return data.products;
        },
        getData: function () {
            return data;
        },
        getProductByID: function (id) {
            let product = null;
            data.products.forEach(function (prd) {
                if (prd.id == id) {
                    product = prd;
               } 
            });
            return product;
        },
        setCurrentProduct: function (product) {
            data.selectedProduct = product;
        },
        addProduct: function (name, price) {
            let id;
            if (data.products.length > 0) {
                id = data.products[data.products.length - 1].id + 1;
            } else {
                id = 0;
            }

            const newProduct = new Product(id, name, parseFloat(price));
            data.products.push(newProduct);
            return newProduct;
        },
        updateProduct: function (productName, productPrice) {
            let product = null;
            data.products.forEach(function (prd) {
                if (prd.id == data.selectedProduct.id) {
                    prd.name = productName;
                    prd.price = parseFloat(productPrice);
                    product = prd;
               } 
            });
            return product;
        },
        deleteProduct: function (product) {
            data.products.forEach(function (prd, index) {
                if (prd.id == product.id) {
                    data.products.splice(index, 1);
               } 
            });
        },
        getCurrentProduct: function () {
            return data.selectedProduct;
        },
        getTotal: function () {
            let total = 0;

            data.products.forEach(function (item) {
                total += item.price; 
            });
            data.totalPrice = total;
            return data.totalPrice;
        },
        
    }
})();

// UI Controller
const UIController = (function () {

    const Selectors = {
        productList: '#item-list',
        productListItems: '#item-list tr',
        addButton: '.addBtn',
        updateButton: '.updateBtn',
        deleteButton: '.deleteBtn',
        cancelButton: '.cancelBtn',
        productName: '#productName',
        productPrice:'#productPrice',
        productCard:'#productCard',
        totalTl:'#totalTl',
        totalUsd:'#totalUsd'
    }

    return {
        createProductList: function (products) {
            let html = '';

            products.forEach(prd => {
                html += `
                    <tr>
                        <td>${prd.id}</td>
                        <td>${prd.name}</td>
                        <td>${prd.price}</td>
                        <td class="text-end">
                            <i class="far fa-edit editProduct"></i>
                        </td>
                    </tr>
                `;
            });

            document.querySelector(Selectors.productList).innerHTML = html;
        },
        getSelectors: function () {
            return Selectors;
        },
        addProduct: function (prd) {
            document.querySelector(Selectors.productCard).style.display = 'block';
            var item = `
                <tr>
                        <td>${prd.id}</td>
                        <td>${prd.name}</td>
                        <td>${prd.price}$</td>
                        <td class="text-end">
                            <i class="far fa-edit editProduct"></i>
                        </td>
                </tr>
            `;
            document.querySelector(Selectors.productList).innerHTML += item;
        },
        updateProduct: function (prd) {
            console.log(prd);
            let updadatedItem = null;
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.children[1].textContent = prd.name;
                    item.children[2].textContent = prd.price + '$';
                    updadatedItem = item;
                }
            });
            return updadatedItem;
        },
        deleteProduct: function () {
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.remove();
                }
            })
        },
        clearInputs: function () {
            document.querySelector(Selectors.productName).value = '';
            document.querySelector(Selectors.productPrice).value = '';
        },
        clearWarnings: function () {
            const items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.classList.remove('bg-warning');
                } 
            });
        },
        hideCard: function () {
            document.querySelector(Selectors.productCard).style.display = 'none';
        },
        showTotal: function (total) {
            console.log(total);
            document.querySelector(Selectors.totalTl).textContent = total * 18.8;
            document.querySelector(Selectors.totalUsd).textContent = total;
        },
        addProductToForm: function () {
            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value = selectedProduct.name;
            document.querySelector(Selectors.productPrice).value = selectedProduct.price;
        },
        addingState: function (item) {
            UIController.clearWarnings();
            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display = 'inline';
            document.querySelector(Selectors.updateButton).style.display = 'none';
            document.querySelector(Selectors.deleteButton).style.display = 'none';
            document.querySelector(Selectors.cancelButton).style.display = 'none';
        },
        editState: function (tr) {
            tr.classList.add('bg-warning');
            document.querySelector(Selectors.addButton).style.display = 'none';
            document.querySelector(Selectors.updateButton).style.display = 'inline';
            document.querySelector(Selectors.deleteButton).style.display = 'inline';
            document.querySelector(Selectors.cancelButton).style.display = 'inline';
        }
    }
})();

// App Controller
const App = (function (ProductCtrl, UICtrl,StorageCtrl) {
    
    const UISelectors = UICtrl.getSelectors();

    // Load event listeners
    const loadEventListeners = function () {
        // add product event
        document.querySelector(UISelectors.addButton).addEventListener('click', productAddSubmit);
        // edit product click
        document.querySelector(UISelectors.productList).addEventListener('click', productEditClick);
        // edit product submit
        document.querySelector(UISelectors.updateButton).addEventListener('click', productEditSubmit);
        // cancel button click
        document.querySelector(UISelectors.cancelButton).addEventListener('click', cancelUpdate);
        // delete product
        document.querySelector(UISelectors.deleteButton).addEventListener('click', deleteProductSubmit);
    }
    const productAddSubmit = function (e) {
        
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;
        if (productName !== '' && productPrice !== '') {
            // add product
            const newProduct = ProductCtrl.addProduct(productName, productPrice);
            // add product to local storage
            StorageCtrl.storeProduct(newProduct);
            // add product to list
            UIController.addProduct(newProduct);
            // get total
            const total = ProductCtrl.getTotal();
            // show total
            UICtrl.showTotal(total);
            // celar the inputs
            UIController.clearInputs();
            
        }
        e.preventDefault();
    }
    const productEditClick = function (e) {
        if (e.target.classList.contains('editProduct')) {
            const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

            // get selected product
            const product = ProductCtrl.getProductByID(id);
            // get current product
            ProductCtrl.setCurrentProduct(product);
            // add product to UI
            UICtrl.addProductToForm();

            UICtrl.clearWarnings();

            UICtrl.editState(e.target.parentNode.parentNode);
        }

        e.preventDefault();
    }
    const productEditSubmit = function (e) {
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== '') {
            // update product
            const updatedProduct = ProductCtrl.updateProduct(productName, productPrice);

            // update UI
            let item = UICtrl.updateProduct(updatedProduct);
            // get total
            const total = ProductCtrl.getTotal();
            // show total
            UICtrl.showTotal(total);
            // update product in local storage
            StorageCtrl.updateProduct(updatedProduct);
            UICtrl.addingState();
        }
        e.preventDefault();
    }
    const cancelUpdate = function (e) {
        UICtrl.addingState();
        UICtrl.clearWarnings();

        e.preventDefault();
    }
    const deleteProductSubmit = function (e) {
        // get selected product
        const selectedProduct = ProductCtrl.getCurrentProduct();
        // delete product
        ProductCtrl.deleteProduct(selectedProduct);
        // delete product from ui
        UICtrl.deleteProduct(selectedProduct);
        // get total
        const total = ProductCtrl.getTotal();
        // show total
        UICtrl.showTotal(total);
        // delete product in local storage
        StorageCtrl.deleteProduct(selectedProduct.id);
        UICtrl.addingState();

        if (total == 0) {
            UICtrl.hideCard();
        }
        
        e.preventDefault();
    }

    return {
        init: function () {
            console.log('starting app...');
            UICtrl.addingState();
            
            const products = ProductCtrl.getProducts();
            const total = ProductCtrl.getTotal();
            UICtrl.showTotal(total);
            if (products.length == 0) {
                UICtrl.hideCard();
            } else {
                UICtrl.createProductList(products);
            }
            // Load event listeners
            loadEventListeners();
        }
    }
})(ProductController, UIController, StorageController);

App.init();