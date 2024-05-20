// Seleção de elementos do DOM
const todoForm = document.querySelector("#todo-form"); // Formulário de adição de tarefa
const todoInput = document.querySelector("#todo-input"); // Campo de entrada para nova tarefa
const todoList = document.querySelector("#todo-list"); // Lista de tarefas
const editForm = document.querySelector("#edit-form"); // Formulário de edição de tarefa
const editInput = document.querySelector("#edit-input"); // Campo de entrada para editar tarefa
const cancelEditBtn = document.querySelector("#cancel-edit-btn"); // Botão para cancelar edição
const searchInput = document.querySelector("#search-input"); // Campo de pesquisa
const eraseBtn = document.querySelector("#erase-button"); // Botão para limpar campo de pesquisa
const filterBtn = document.querySelector("#filter-select"); // Seleção para filtrar tarefas

let oldInputValue; // Variável para armazenar o valor antigo da tarefa ao editar

// Função para adicionar uma nova tarefa à lista
const saveTodo = (text, done = 0, save = 1) => {
    const todo = document.createElement("div"); // Cria um novo elemento div para a tarefa
    todo.classList.add("todo"); // Adiciona a classe "todo" ao elemento div

    const todoTitle = document.createElement("h3"); // Cria um elemento h3 para o título da tarefa
    todoTitle.innerText = text; // Define o texto da tarefa
    todo.appendChild(todoTitle); // Adiciona o título à div da tarefa

    const doneBtn = document.createElement("button"); // Cria um botão para marcar a tarefa como concluída
    doneBtn.classList.add("finish-todo"); // Adiciona a classe "finish-todo" ao botão
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'; // Adiciona um ícone de marcação ao botão
    todo.appendChild(doneBtn); // Adiciona o botão à div da tarefa

    const editBtn = document.createElement("button"); // Cria um botão para editar a tarefa
    editBtn.classList.add("edit-todo"); // Adiciona a classe "edit-todo" ao botão
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'; // Adiciona um ícone de edição ao botão
    todo.appendChild(editBtn); // Adiciona o botão à div da tarefa

    const deleteBtn = document.createElement("button"); // Cria um botão para excluir a tarefa
    deleteBtn.classList.add("remove-todo"); // Adiciona a classe "remove-todo" ao botão
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'; // Adiciona um ícone de exclusão ao botão
    todo.appendChild(deleteBtn); // Adiciona o botão à div da tarefa

    // Utilizando dados da localStorage
    if (done) {
        todo.classList.add("done"); // Adiciona a classe "done" se a tarefa estiver concluída
    }

    if (save) {
        saveTodoLocalStorage({ text, done: 0 }); // Salva a tarefa no armazenamento local, se necessário
    }

    todoList.appendChild(todo); // Adiciona a div da tarefa à lista de tarefas
    todoInput.value = ""; // Limpa o campo de entrada após adicionar a tarefa
};

// Função para alternar entre os formulários de adição e edição de tarefas
const toggleForms = () => {
    editForm.classList.toggle("hide"); // Alterna a visibilidade do formulário de edição
    todoForm.classList.toggle("hide"); // Alterna a visibilidade do formulário de adição
    todoList.classList.toggle("hide"); // Alterna a visibilidade da lista de tarefas
};

// Função para atualizar o texto de uma tarefa
const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo"); // Seleciona todas as tarefas

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3"); // Seleciona o título da tarefa

        // Verifica se o título corresponde ao valor antigo da tarefa
        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text; // Atualiza o texto da tarefa

            // Atualiza o armazenamento local com o novo texto da tarefa
            updateTodoLocalStorage(oldInputValue, text);
        }
    });
};

// Função para filtrar tarefas com base no valor selecionado
const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo"); // Seleciona todas as tarefas

    // Verifica o valor selecionado e exibe as tarefas correspondentes
    switch (filterValue) {
        case "all":
            todos.forEach((todo) => (todo.style.display = "flex")); // Exibe todas as tarefas
            break;

        case "done":
            todos.forEach((todo) =>
                todo.classList.contains("done")
                    ? (todo.style.display = "flex") // Exibe apenas as tarefas concluídas
                    : (todo.style.display = "none")
            );
            break;

        case "todo":
            todos.forEach((todo) =>
                !todo.classList.contains("done")
                    ? (todo.style.display = "flex") // Exibe apenas as tarefas a fazer
                    : (todo.style.display = "none")
            );
            break;

        default:
            break;
    }
};

// Eventos

// Evento de envio do formulário de adição de tarefa
todoForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita o comportamento padrão de recarregar a página

    const inputValue = todoInput.value.trim(); // Obtém o valor do campo de entrada

    if (inputValue) {
        saveTodo(inputValue); // Salva a nova tarefa se o campo não estiver vazio
    } else {
        alert("Você não pode inserir uma tarefa vazia."); // Exibe um alerta se o campo estiver vazio
    }
});

// Evento de pressionar Enter no campo de entrada de tarefas
todoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault(); // Evita o comportamento padrão de adicionar uma quebra de linha

        const inputValue = todoInput.value.trim(); // Obtém o valor do campo de entrada

        if (inputValue) {
            saveTodo(inputValue); // Salva a nova tarefa se o campo não estiver vazio
        } else {
            alert("Você não pode inserir uma tarefa vazia."); // Exibe um alerta se o campo estiver vazio
        }
    }
});

// Evento de clique em qualquer lugar do documento
document.addEventListener("click", (e) => {
    const targetEl = e.target; // Elemento clicado
    const parentEl = targetEl.closest("div"); // Elemento pai do elemento clicado
    let todoTitle; // Variável para armazenar o título da tarefa

    // Verifica se o elemento pai contém um título de tarefa
    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText || ""; // Obtém o título da tarefa clicada
    }

    // Verifica se o botão "Concluir" foi clicado
    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done"); // Alterna a classe "done" da tarefa
        updateTodoStatusLocalStorage(todoTitle); // Atualiza o status da tarefa no armazenamento local
    }

    // Verifica se o botão "Remover" foi clicado
    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove(); // Remove a tarefa do DOM
        removeTodoLocalStorage(todoTitle); // Remove a tarefa do armazenamento local
    }

    // Verifica se o botão "Editar" foi clicado
    if (targetEl.classList.contains("edit-todo")) {
        toggleForms(); // Alterna entre os formulários de adição e edição
        editInput.value = todoTitle; // Preenche o campo de edição com o título da tarefa
        oldInputValue = todoTitle; // Armazena o título antigo da tarefa
    }
});

// Evento de clique no botão "Cancelar" do formulário de edição
cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Evita o comportamento padrão do botão
    toggleForms(); // Alterna entre os formulários de adição e edição
});

// Evento de envio do formulário de edição de tarefa
editForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita o comportamento padrão de recarregar a página
    const editInputValue = editInput.value; // Obtém o novo valor da tarefa editada

    if (editInputValue) {
        updateTodo(editInputValue); // Atualiza o texto da tarefa
    }

    toggleForms(); // Alterna entre os formulários de adição e edição
});

// Evento de entrada no campo de pesquisa
searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value; // Obtém o valor digitado no campo de pesquisa
    getSearchedTodos(search); // Filtra e exibe as tarefas correspondentes à pesquisa
});

// Evento de clique no botão de limpar campo de pesquisa
eraseBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Evita o comportamento padrão do botão
    searchInput.value = ""; // Limpa o campo de pesquisa
    searchInput.dispatchEvent(new Event("keyup")); // Ativa o evento de pesquisa para exibir todas as tarefas
});

// Evento de alteração na seleção de filtro de tarefas
filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value; // Obtém o valor selecionado no filtro
    filterTodos(filterValue); // Filtra e exibe as tarefas conforme o filtro selecionado
});

// Local Storage
const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || []; // Obtém as tarefas do armazenamento local ou retorna uma lista vazia
    return todos; // Retorna a lista de tarefas
};

const loadTodos = () => {
    const todos = getTodosLocalStorage(); // Obtém as tarefas do armazenamento local

    // Adiciona cada tarefa do armazenamento local à lista de tarefas
    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0);
    });

    todoInput.focus(); // Define o foco no campo de entrada de tarefas
};

const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage(); // Obtém as tarefas do armazenamento local
    todos.push(todo); // Adiciona a nova tarefa à lista de tarefas
    localStorage.setItem("todos", JSON.stringify(todos)); // Salva a lista atualizada no armazenamento local
};

const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage(); // Obtém as tarefas do armazenamento local
    const filteredTodos = todos.filter((todo) => todo.text != todoText); // Filtra as tarefas para remover a tarefa com o texto especificado
    localStorage.setItem("todos", JSON.stringify(filteredTodos)); // Salva a lista atualizada no armazenamento local
};

const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage(); // Obtém as tarefas do armazenamento local

    // Atualiza o status da tarefa correspondente no armazenamento local
    todos.map((todo) =>
        todo.text === todoText ? (todo.done = !todo.done) : null
    );

    localStorage.setItem("todos", JSON.stringify(todos)); // Salva a lista atualizada no armazenamento local
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage(); // Obtém as tarefas do armazenamento local

    // Atualiza o texto da tarefa correspondente no armazenamento local
    todos.map((todo) =>
        todo.text === todoOldText ? (todo.text = todoNewText) : null
    );

    localStorage.setItem("todos", JSON.stringify(todos)); // Salva a lista atualizada no armazenamento local
};

loadTodos(); // Carrega as tarefas do armazenamento local ao carregar a página
