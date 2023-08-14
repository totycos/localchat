Rails.application.routes.draw do
  resources :messages
  devise_for :users, controllers: {
    sessions: 'users/sessions'
    # Ajoutez ici d'autres contrôleurs personnalisés si nécessaire
  }
  
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "messages#index"
end
