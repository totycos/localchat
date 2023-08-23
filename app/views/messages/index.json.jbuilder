json.messages @messages do |message|
  json.partial! "messages/message", message: message
end

json.users @users do |user|
  json.user do
    json.extract! user, :pseudo
    json.location do
      json.extract! user.location, :latitude, :longitude
      json.tooltip user.pseudo
    end
  end
end

