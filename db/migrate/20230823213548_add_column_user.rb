class AddColumnUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :feeling, :string 
    add_column :users, :bio, :text
  end
end
