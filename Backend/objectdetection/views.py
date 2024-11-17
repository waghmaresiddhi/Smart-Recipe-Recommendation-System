import cv2

# Load the XML file for face detection
xml_data = cv2.CascadeClassifier(r'C:\Users\Siddhi Waghmare\Desktop\Smart-Recipe-Recommendation-System\Backend\objectdetection\XML-data.xml')

# Open the webcam
cap = cv2.VideoCapture(0)

while True:
    # Capture frames from the webcam
    ret, frame = cap.read()
    if not ret:
        break
    
    # Convert the frame to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Detect faces in the image
    detecting = xml_data.detectMultiScale(gray, minSize=(30, 30))
    
    # If faces are detected, draw rectangles around them
    for (x, y, w, h) in detecting:
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 3)
    
    # Display the frame
    cv2.imshow("Face Detection", frame)
    
    # Break the loop if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the webcam and close windows
cap.release()
cv2.destroyAllWindows()
