<?php

namespace App\Http\Requests\Manager;

class UpdateEventRequest extends StoreEventRequest
{
    // Same rules — end_date only needs to be after_or_equal:event_date
}
