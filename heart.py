import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn import preprocessing
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# Load the dataset
try:
    disease_df = pd.read_csv("E:/programming/aiml/project/framingham.csv")
    
    # Data preprocessing
    disease_df.drop(['education'], inplace=True, axis=1)
    disease_df.rename(columns={'male': 'Sex_male'}, inplace=True)
    disease_df.dropna(axis=0, inplace=True)
    
    # Prepare features and target
    X = np.asarray(disease_df[['age', 'Sex_male', 'cigsPerDay', 'totChol', 'sysBP', 'glucose']])
    y = np.asarray(disease_df['TenYearCHD'])
    
    # Standardize features
    X = preprocessing.StandardScaler().fit(X).transform(X)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=4)
    
    print('Train set:', X_train.shape, y_train.shape)
    print('Test set:', X_test.shape, y_test.shape)
    
    # Visualize class distribution
    plt.figure(figsize=(7, 5))
    sns.countplot(x='TenYearCHD', data=disease_df, palette="BuGn_r")
    plt.title('Distribution of CHD Risk')
    plt.savefig('chd_distribution.png')
    plt.show()
    
    # Train logistic regression model
    logreg = LogisticRegression(max_iter=1000)
    logreg.fit(X_train, y_train)
    
    # Make predictions
    y_pred = logreg.predict(X_test)
    
    # Model evaluation
    print('Accuracy of the model is =', accuracy_score(y_test, y_pred))
    print('The details for confusion matrix is =')
    print(classification_report(y_test, y_pred))
    
    # Create confusion matrix visualization
    cm = confusion_matrix(y_test, y_pred)
    conf_matrix = pd.DataFrame(data=cm, columns=['Predicted:0', 'Predicted:1'], index=['Actual:0', 'Actual:1'])
    
    plt.figure(figsize=(8, 5))
    sns.heatmap(conf_matrix, annot=True, fmt='d', cmap="Greens")
    plt.title('Confusion Matrix')
    plt.savefig('confusion_matrix.png')
    plt.show()
    
    # Save the model coefficients for later use in the web app
    feature_names = ['Age', 'Sex (Male)', 'Cigarettes Per Day', 'Total Cholesterol', 'Systolic BP', 'Glucose']
    coef_df = pd.DataFrame({'Feature': feature_names, 'Coefficient': logreg.coef_[0]})
    coef_df.to_csv('model_coefficients.csv', index=False)
    
    print("Analysis completed successfully. Images and model data saved.")
    
except Exception as e:
    print(f"An error occurred: {e}")