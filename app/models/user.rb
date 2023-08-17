class User < ApplicationRecord
  after_create :create_chat_setting

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :messages
  has_one :location
  has_one :chat_setting

  private

  def create_chat_setting
    ChatSetting.create(user_id: self.id, general: "1", business: "1")
  end
  
end
