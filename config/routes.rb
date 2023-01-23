Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :maps
  get '/' => 'maps#index'
  post '/' => 'maps#index'
  #resources :movies
  get '/movies' => 'movies#index'
  post '/movies' => 'movies#index'
end
