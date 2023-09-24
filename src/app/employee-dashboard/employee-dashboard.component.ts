import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})

export class EmployeeDashboardComponent implements OnInit {
  
  userData: any = {}; // Initialize an empty object to store the API data
  usersData: any[] = [];
  formData: any = {};
  updatedData: any = {};
  user: any = {};
  selectedUserId: string | undefined;
  
  constructor(private http: HttpClient,
     private toastr: ToastrService,
     ) {}

  ngOnInit() {
    this.http.get('http://localhost:3000/api/getUser').subscribe((data: any) => {
      this.userData = data.data.userDetails;
      if (this.userData.length > 0) {
        this.selectedUserId = this.userData[0]._id;
      }
    })
  }

  onSubmit() {

    if (this.formData.userId) {

      // Define the updated user data
      const updatedUserData = {
        name: this.formData.name,
        email: this.formData.email,
        address: this.formData.address,
        class: this.formData.class,
        phone_number: this.formData.phone_number,
        image: this.formData.image
      };


      // Make the PUT request to update the user
      this.http.put(`http://localhost:3000/api/updateUser/${this.formData.userId}`, updatedUserData).subscribe(
        (response: any) => {
          this.toastr.success('User updated successfully');
          window.location.reload(); // Reload the page or update the user data in your UI
        },
        (error) => {
          console.error('PUT Request Error:', error);
          // Handle the error, e.g., display an error message
          this.toastr.error('Failed to update user');
        }
      );
    } else {
      this.http.post('http://localhost:3000/api/adduser', this.formData).subscribe(
        (response: any) => {
          this.toastr.success('User Registered Successfully');
          window.location.reload();
         
        },
        (error) => {
          console.log(error.error.message)
          this.toastr.error(error.error.message);

        }
      );
    }
  }



deleteUser(user: any) {

  if (!user) {
    console.error('No user selected for deletion.');
    return;
  }

  this.http.delete(`http://localhost:3000/api/deleteUser/${user._id}`).subscribe(
    (response) => {
      console.log(response)
      this.toastr.success('User Deleted Successfully');
      window.location.reload();
    },
    (error) => {
      console.error('DELETE Request Error:', error);
    }
  );
}



editUser(user: any) {
  // Make an API request to fetch user data by their _id

  this.http.get(`http://localhost:3000/api/getUserById/${user._id}`).subscribe((result: any) => {

    this.formData = result; // Assign the fetched data to the formData object
    this.formData.userId = result.data.userDetails[0]._id;
    this.formData.name = result.data.userDetails[0].name;
    this.formData.email = result.data.userDetails[0].email;
    this.formData.address = result.data.userDetails[0].address;
    this.formData.class = result.data.userDetails[0].class;
    this.formData.phone_number = result.data.userDetails[0].phone_number;
    this.formData.image = result.data.userDetails[0].image;
  });
}


imageUpload(event: any): void {
  const fileToUpload = event.target.files[0];

  if (fileToUpload) {
    const formData = new FormData();
    formData.append('profile', fileToUpload); 

    this.http.post('http://localhost:3000/api/upload', formData).subscribe(
      (response: any) => {
        this.toastr.success('Image uploaded successfully');
        
      },
      (error) => {
        console.error('Image Upload Error:', error);
        this.toastr.error('Failed to upload image');
      }
    );
  }
}
}
