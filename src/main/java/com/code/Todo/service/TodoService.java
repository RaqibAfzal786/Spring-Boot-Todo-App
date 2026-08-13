package com.code.Todo.service;

import com.code.Todo.model.Todo;
import com.code.Todo.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class TodoService {

    private TodoRepository todoRepository;
    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public List<Todo> getAllTodos(){
        return todoRepository.findAll();
    }


    public Todo getTodoById(Long id){
      return todoRepository.findById(id).orElseThrow(()
              -> new RuntimeException("Todo not found with id: " + id));
    }



    public Todo createTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    public Todo updateTodo(Long id , Todo todo){
        Todo existingTodo = getTodoById(id);
        existingTodo.setTitle(todo.getTitle());
        existingTodo.setDescription(todo.getDescription());
        existingTodo.setCompleted(todo.isCompleted());
            return todoRepository.save(existingTodo);
        }


    public String deleteTodo(Long id){

        if(todoRepository.existsById(id)){
            todoRepository.deleteById(id);
            return "Todo deleted successfully";
        }
        return "Todo not found with id: " + id;
    }
}
