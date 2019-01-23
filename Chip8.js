var Processor = new function()
{
    this.Memory = new Uint8Array(4096); // Stores instructions
    this.Memory[0] = ("0x0000" & "0xFF00") >>> 8;
    this.Memory[1] = ("0x0000" & "0x00FF");
    this.Memory[2] = ("0x00E0" & "0xFF00") >>> 8;
    this.Memory[3] = ("0x00E0" & "0x00FF");
    this.Memory[4] = ("0x1000" & "0xFF00") >>> 8;
    this.Memory[5] = ("0x1000" & "0x00FF");
    this.Memory[6] = ("0x2000" & "0xFF00") >>> 8;
    this.Memory[7] = ("0x2000" & "0x00FF");
    this.Memory[8] = ("0x3000" & "0xFF00") >>> 8; // SkipNextInstruction_VxEQkk
    this.Memory[9] = ("0x3000" & "0x00FF");

    this.Memory[50] = ("0xE000" & "0xF000") >>> 8; // SkipNextInstruction_KeyUp
    this.Memory[51] = ("0x00A1" & "0x00FF");

    this.Memory[52] = ("0xF000" & "0xF000") >>> 8; // SetVxtoDT
    this.Memory[53] = ("0x0007" & "0x00FF");
    this.Memory[54] = ("0xF000" & "0xF000") >>> 8; // WaitSetVxtoKeydown
    this.Memory[55] = ("0x000A" & "0x00FF");
    this.Memory[56] = ("0xF000" & "0xF000") >>> 8; // SetDelayTimer_VxTODT
    this.Memory[57] = ("0x0015" & "0x00FF");
    this.Memory[58] = ("0xF000" & "0xF000") >>> 8; // SetSoundTimer
    this.Memory[59] = ("0x0018" & "0x00FF");

    this.Registers = new Uint8Array(16);
    this.Stack = new Uint16Array(16);
    this.KeyboardBuffer = [];


    this.display_width = 64;        //display data
    this.display_height = 32;
    this.display = new Array(this.display_width  * this.display_height);
    console.log(this.display.length);


    this.delayTimer = 0;
    this.soundTimer = 0;
    this.PC = 0;

    this.pause = false;

    this.init = function() // Resets values/variables
    {
        console.log(this.Memory[51]);

        this.Registers[0] = 10;
        this.Registers[1] = 6;
    };

    this.fetch = function() // Fetches from the program stored in the memory
    {
    };

    this.execute = function(opcode) // Finds ("reads") and executes
    {
        for (var i = 0; i < 512; i += 2) // Traverses over memory locations 0 to 511 (0x01FF)
        {
            if ((opcode & "0xF000") >>> 8 == this.Memory[i]) // Finds a match
            {
                if (i == 8) // SkipNextInstruction_VxEQkk
                //if (this.Memory[i] == 48) // SkipNextInstruction_VxEQkk
                {
                    if (this.Registers[(opcode & "0x0F00") >>> 8] == (opcode & "0x00FF"))
                    {
                        this.PC += 2;
                    }
                    break;
                }

                else if (i >= 48 && i <= 51) // 0xE000 opcodes
                {
                    if ((opcode & "0x00FF") == this.Memory[i + 1])
                    {
                        if (i == 48)
                        {
                        }
                        if (i == 50) // SkipNextInstruction_KeyUp
                        {
                            var hexCode = this.Registers[(opcode & "0x0F00") >>> 8];
                            var convertHex = function(code) // Converts a hexadecimal into a keyboard input
                            {
                                if (code == 0)
                                {
                                    return 49;
                                }
                                else if (code == 1)
                                {
                                    return 50;
                                }
                                else if (code == 2)
                                {
                                    return 51;
                                }
                                else if (code == 3)
                                {
                                    return 52;
                                }
                                else if (code == 4)
                                {
                                    return 81;
                                }
                                else if (code == 5)
                                {
                                    return 87;
                                }
                                else if (code == 6)
                                {
                                    return 69;
                                }
                                else if (code == 7)
                                {
                                    return 82;
                                }
                                else if (code == 8)
                                {
                                    return 65;
                                }
                                else if (code == 9)
                                {
                                    return 83;
                                }
                                else if (code == 10)
                                {
                                    return 68;
                                }
                                else if (code == 11)
                                {
                                    return 70;
                                }
                                else if (code == 12)
                                {
                                    return 90;
                                }
                                else if (code == 13)
                                {
                                    return 88;
                                }
                                else if (code == 14)
                                {
                                    return 67;
                                }
                                else if (code == 15)
                                {
                                    return 86;
                                }
                            };

                            var key = convertHex(hexCode);
                            if (this.KeyboardBuffer[0] == key)
                            {
                                this.PC += 2;
                                console.log("This works!");
                            }
                        }
                    }
                }

                else if (i >= 52 && i <= 69) // 0xF000 opcodes
                {
                    if ((opcode & "0x00FF") == this.Memory[i + 1])
                    {
                        if (i == 52) //SetVxtoDT
                        {
                            this.Registers[(opcode & "0x0F00") >>> 8] = this.delayTimer;
                            console.log("V" + ((opcode & "0x0F00") >>> 8) + ": " + this.Registers[(opcode & "0x0F00") >>> 8]);
                            break;
                        }
                        else if (i == 54) // WaitSetVxtoKeydown
                        {
                            this.pause = true;

                            var valid = true; // Checks for valid keys
                            var _this = this;
                            document.onkeydown = function(key) // Is this necessary?
                            {
                                if (key.keyCode == 49)
                                {
                                    valid = true;
                                    console.log("1 is pressed!");
                                }
                                else if (key.keyCode == 50)
                                {
                                    valid = true;
                                    console.log("2 is pressed!");
                                }
                                else if (key.keyCode == 51)
                                {
                                    valid = true;
                                    console.log("3 is pressed!");
                                }
                                else if (key.keyCode == 52)
                                {
                                    valid = true;
                                    console.log("4 is pressed!");
                                }
                                else if (key.keyCode == 81)
                                {
                                    valid = true;
                                    console.log("Q is pressed!");
                                }
                                else if (key.keyCode == 87)
                                {
                                    valid = true;
                                    console.log("W is pressed!");
                                }
                                else if (key.keyCode == 69)
                                {
                                    valid = true;
                                    console.log("E is pressed!");
                                }
                                else if (key.keyCode == 82)
                                {
                                    valid = true;
                                    console.log("R is pressed!");
                                }
                                else if (key.keyCode == 65)
                                {
                                    valid = true;
                                    console.log("A is pressed!");
                                }
                                else if (key.keyCode == 83)
                                {
                                    valid = true;
                                    console.log("S is pressed!");
                                }
                                else if (key.keyCode == 68)
                                {
                                    valid = true;
                                    console.log("D is pressed!");
                                }
                                else if (key.keyCode == 70)
                                {
                                    valid = true;
                                    console.log("F is pressed!");
                                }
                                else if (key.keyCode == 90)
                                {
                                    valid = true;
                                    console.log("Z is pressed!");
                                }
                                else if (key.keyCode == 88)
                                {
                                    valid = true;
                                    console.log("X is pressed!");
                                }
                                else if (key.keyCode == 67)
                                {
                                    valid = true;
                                    console.log("C is pressed!");
                                }
                                else if (key.keyCode == 86)
                                {
                                    valid = true;
                                    console.log("V is pressed!");
                                }
                                else
                                {
                                    valid = false; // A invalid key is pressed.
                                }

                                if (valid) // A valid key is pressed.
                                {
                                    _this.pause = false;
                                    if (_this.KeyboardBuffer.length == 0)
                                    {
                                        _this.KeyboardBuffer.push(key.keyCode);
                                    }
                                    document.onkeydown = null;
                                }
                            };
                        }
                        else if (i == 56) //SetDelayTimer_VxTODT
                        {
                            this.delayTimer = this.Registers[((opcode & "0x0F00") >>> 8)];
                            break;
                        }
                        else if (i == 58) //SetSoundTimer_VxTOST
                        {
                            this.soundTimer = this.Registers[((opcode & "0x0F00") >>> 8)];
                            break;
                        }
                    }
                    else
                    {
                        continue;
                    }
                }
            }
        }
    }

    this.TickTimers = function() // The timers will decrease by one at a rate of 60Hz.
    {
        if (this.delayTimer > 0)
        {
            this.delayTimer--;
        }
        if (this.soundTimer > 0)
        {
            this.soundTimer--;
        }
        if (this.soundTimer == 0) // Plays a tone when the sound timer reaches 0
        {

        }
        //console.log("DT: " + this.delayTimer);
        console.log("ST: " + this.soundTimer);
    };

    this.display_test = function()          //display test
    {
        for(i=0; i < this.display.length; i++)               
        {   
            i = i+2;
            this.display[i] = 0;
        }
    }
    console.log("test completed");

    this.get_display_width = function()  //get display methods
    {
        return this.display_width;
    }

    this.get_display_height = function()
    {
        return this.display_height;
    }

    this.get_display = function()
    {
        return this.display;
    }

    this.main = function()
    {
        var _this = this;

        setInterval(function()
        {
            if (!_this.pause)
            {
                _this.TickTimers();

                window.onkeydown = function(event)
                {
                    if (_this.KeyboardBuffer.length == 0)
                    {
                        _this.KeyboardBuffer.push(event.keyCode);
                    }
                    window.onkeydown = null;
                }
            }

            window.onkeyup = function(event)
            {
                if (_this.KeyboardBuffer.length != 0)
                {
                    if (_this.KeyboardBuffer[0] == event.keyCode)
                    {
                        _this.KeyboardBuffer.shift();
                        console.log("Removed a key from the array!");
                    }
                }
                window.onkeyup = null;
            };

            /*document.addEventListener("keydown", function(event)
            {
                _this.KeyboardBuffer.push(event);
                if (_this.KeyboardBuffer.length == 0);
                {
                    if (event.keyCode == 65)
                    {
                    }
                }
            });*/
        }, 16.6667); // Each cycle in the emulator lasts for 16.66 ms.
    };
}